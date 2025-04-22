import { FileUploader } from "@/components/costum-components/file-uploader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
          <main className="flex min-h-240 flex-col items-center justify-between p-6 md:p-24">
            <div className=" max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-center mb-2">APODP Converter</h1>
                <p className="text-center text-muted-foreground mb-6">
                  Upload Excel files to convert APODP format fields automatically
                </p>
                <FileUploader />
              </div>
            </div>
          </main>
    </div>
  )
}
