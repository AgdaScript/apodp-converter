export type FileStatus = "pending" | "processing" | "completed" | "error"

export interface FileWithProgress {
  file: File
  id: string
  progress: number
  status: FileStatus
  error: string | null
  result: Blob | null
}
