"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileList } from "./file-list"
import { UploadIcon as FileUploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileWithProgress } from "@/lib/types"
import { processExcelFile } from "@/lib/excel-processor"

export function FileUploader() {
  const [files, setFiles] = useState<FileWithProgress[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .filter((file) => {
        const isExcel =
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        if (!isExcel) {
          console.error(`File ${file.name} is not an Excel file`)
          return false
        }

        return true
      })
      .map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
        progress: 0,
        status: "pending" as const,
        error: null,
        result: null,
      }))

    setFiles((prev) => [...prev, ...newFiles])

    // Process each file
    for (const fileWithProgress of newFiles) {
      try {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileWithProgress.id ? { ...f, status: "processing", progress: 10 } : f)),
        )

        // Process the file
        const result = await processExcelFile(fileWithProgress.file, (progress) => {
          setFiles((prev) => prev.map((f) => (f.id === fileWithProgress.id ? { ...f, progress } : f)))
        })

        setFiles((prev) =>
          prev.map((f) => (f.id === fileWithProgress.id ? { ...f, status: "completed", progress: 100, result } : f)),
        )
      } catch (error) {
        console.error(`Error processing file ${fileWithProgress.file.name}:`, error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id
              ? { ...f, status: "error", error: error instanceof Error ? error.message : "Unknown error" }
              : f,
          ),
        )
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <FileUploadIcon className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg font-medium">{isDragActive ? "Drop your files here" : "Drop your file here, or"}</p>
          {!isDragActive && (
            <Button variant="link" className="text-primary">
              Browse
            </Button>
          )}
          <p className="text-sm text-muted-foreground">Maximum file size 50mb</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
          <FileList files={files} onRemove={removeFile} />
        </div>
      )}
    </div>
  )
}
