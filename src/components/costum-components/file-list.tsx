"use client"

import type { FileWithProgress } from "@/lib/types"
import { formatFileSize } from "@/lib/utils"
import { FileIcon, XIcon, DownloadIcon, AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileListProps {
  files: FileWithProgress[]
  onRemove: (id: string) => void
}

export function FileList({ files, onRemove }: FileListProps) {
  const handleDownload = (file: FileWithProgress) => {
    if (!file.result) return

    // Create a download link
    const url = URL.createObjectURL(file.result)
    const a = document.createElement("a")
    a.href = url
    a.download = file.file.name.replace(/\.[^/.]+$/, "") + "_converted.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Clean up the URL
    URL.revokeObjectURL(url)

    // Remove the file from the list
    onRemove(file.id)
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{file.file.name}</p>
              <p className="text-sm text-muted-foreground">Excel • {formatFileSize(file.file.size)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {file.status === "pending" || file.status === "processing" ? (
              <>
                <div className="w-32">
                  <Progress value={file.progress} className="h-2" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(file.id)}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </>
            ) : file.status === "completed" ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => handleDownload(file)}
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
            ) : (
              <div className="flex items-center text-destructive">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{file.error || "Error"}</span>
                <Button variant="ghost" size="icon" onClick={() => onRemove(file.id)} className="ml-2">
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
