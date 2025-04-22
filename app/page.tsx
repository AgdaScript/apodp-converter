'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'

interface FileProgress {
  name: string
  size: string
  type: string
  progress: number
  status: 'processing' | 'completed' | 'error'
  processedData?: Uint8Array
}

export default function Home() {
  const [files, setFiles] = useState<FileProgress[]>([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processExcelFile = async (file: File) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        // Convert fields from text to number
        const processedData = jsonData.map((row: any) => ({
          ...row,
          APNATR: Number(row.APNATR),
          APNSEQ: Number(row.APNSEQ),
          APNATG: Number(row.APNATG),
          APNSEQG: Number(row.APNSEQG),
          APCONTA: Number(row.APNSEQ),
          APCONTAG: Number(row.APNSEQG)
        }))
        
        // Create new workbook
        const newWorkbook = XLSX.utils.book_new()
        const newWorksheet = XLSX.utils.json_to_sheet(processedData)
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1')
        
        // Generate buffer for download
        const buffer = XLSX.write(newWorkbook, { type: 'array' })
        
        setFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? { 
                  ...f, 
                  progress: 100, 
                  status: 'completed',
                  processedData: new Uint8Array(buffer)
                }
              : f
          )
        )
      } catch (error) {
        setFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? { ...f, status: 'error' }
              : f
          )
        )
      }
    }
    
    reader.readAsArrayBuffer(file)
  }

  const handleDownload = (file: FileProgress) => {
    if (!file.processedData) return

    const blob = new Blob([file.processedData], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace('.xlsx', '')}-convertido.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Remove file from list after download
    setFiles(prev => prev.filter(f => f.name !== file.name))
  }

  const handleRemove = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      progress: 0,
      status: 'processing' as const
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    acceptedFiles.forEach(file => {
      processExcelFile(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  })

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">APODP Converter</h1>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-lg">Drag and drop Excel files here</p>
          <p className="text-sm text-gray-500">or click to browse files</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {files.map((file) => (
          <div key={file.name} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{file.size}</p>
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'completed' ? (
                  <button
                    onClick={() => handleDownload(file)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Download
                  </button>
                ) : file.status === 'processing' ? (
                  <span className="text-blue-500">Processing...</span>
                ) : (
                  <span className="text-red-500">Error</span>
                )}
                <button
                  onClick={() => handleRemove(file.name)}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded">
              <div
                className={`h-2 rounded transition-all ${
                  file.status === 'completed' 
                    ? 'bg-green-500' 
                    : file.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}