import { FileUploader } from "@/components/costum-components/file-uploader"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">APODP Converter</h1>
          <p className="text-center text-muted-foreground mb-6">
            Upload Excel files to convert APODP format fields automatically
          </p>
          <FileUploader />
        </div>
      </div>
    </main>
  )
}
