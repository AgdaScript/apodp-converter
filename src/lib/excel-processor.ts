import * as XLSX from "xlsx"

export async function processExcelFile(file: File, onProgress: (progress: number) => void): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        onProgress(30)

        // Read the Excel file
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        onProgress(50)

        // Process each worksheet
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]

          // Convert to JSON to easily manipulate the data
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          // Process the data - convert fields from text to number and rename columns
          const processedData = jsonData.map((row) => {
            const newRow = { ...row }

            // Convert fields from text to number
            if ("APNATR" in newRow) newRow.APNATR = Number(newRow.APNATR)
            if ("APNSEQ" in newRow) {
              newRow.APCONTA = Number(newRow.APNSEQ)
              delete newRow.APNSEQ
            }
            if ("APNATG" in newRow) newRow.APNATG = Number(newRow.APNATG)
            if ("APNSEQG" in newRow) {
              newRow.APCONTAG = Number(newRow.APNSEQG)
              delete newRow.APNSEQG
            }

            return newRow
          })

          onProgress(70)

          // Convert back to worksheet
          const newWorksheet = XLSX.utils.json_to_sheet(processedData)

          // Replace the worksheet in the workbook
          workbook.Sheets[sheetName] = newWorksheet
        })

        onProgress(90)

        // Write to a new Excel file
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

        // Convert to Blob
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

        onProgress(100)
        resolve(blob)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    // Start reading the file
    reader.readAsArrayBuffer(file)
  })
}
