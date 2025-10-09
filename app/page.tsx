/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Camera, ImageIcon } from "lucide-react"
import { useImageStore } from "@/hooks/use-image-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CameraCapture from "@/components/camera-capture"

export default function HomePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setImage } = useImageStore()

  function onFileSelected(file?: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : ""
      if (dataUrl) {
        setImage(dataUrl)
        router.push("/preview")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-0 max-h-[100vh] flex items-center justify-center p-4 bg-[radial-gradient(900px_500px_at_85%_-10%,var(--brand-blue-50),white)]">
      <Card className="relative w-full max-w-[420px] h-[100vh] overflow-hidden rounded-2xl">
        {/* Top header */}
        <div className="p-6 pt-8">
          <h1 className="text-5xl font-extrabold leading-[1.02] text-pretty">Skin</h1>
          <h1 className="text-5xl font-extrabold leading-[1.02] -mt-2 text-pretty">Analysis</h1>
          <p className="text-xs text-muted-foreground mt-3 max-w-[28ch]">Stay Ahead with Our Latest Updates: Covering National and International News.</p>
        </div>

        {/* Center illustration */}
        <div className="flex-1 relative flex items-center bottom-28 justify-center  w-[80%]">
          <img
            src="/images/dfs.png"
            alt="Contoh wajah untuk analisis kulit"
            className="object-cover rounded-b-none rounded-xl w-[100%] max-w-[100vw]"
          />
        </div>

        {/* Curved bottom plate with actions */}
        <div className="absolute inset-x-0 -bottom-52">
          <div className="relative">
            <div className="h-96 w-9h-96 rounded-full bg-gradient-to-r from-[#ff8aa3] to-[#9ad0ff]" />

            {/* Circular actions centered above the curve */}
            <div className="absolute left-[35%]  -top-10 flex items-center gap-7">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    aria-label="Buka Kamera"
                    className="w-[131px] border-white border h-[131px] rounded-full bg-(--brand-pink) text-(--on-pink) shadow-2xl grid place-items-center"
                  >
                    <Camera className="h-[50px] w-[50px]" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ambil Foto</DialogTitle>
                  </DialogHeader>
                  <CameraCapture
                    onCapture={(dataUrl) => {
                      setImage(dataUrl)
                      router.push("/preview")
                    }}
                  />
                </DialogContent>
              </Dialog>

              <button
                aria-label="Buka Folder"
                onClick={() => fileInputRef.current?.click()}
                className="w-[76px] relative top-8 h-[76px] border border-white rounded-full bg-(--brand-blue) text-(--on-blue) shadow-md grid place-items-center"
              >
                <ImageIcon className="h-[30px] w-[30px]" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFileSelected(e.target.files?.[0])}
              />
            </div>

            {/* Home bar mimic */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <div className="h-1.5 w-20 rounded-full bg-black/15" />
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
