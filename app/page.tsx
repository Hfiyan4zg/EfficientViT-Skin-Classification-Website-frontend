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
    <main className="min-h-dvh flex items-center justify-center p-4">
      <Card className="relative w-full max-w-[420px] overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-4xl font-semibold leading-[1.1] text-pretty">Skin{"\n"}Analysis</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-[28ch]">
            Ambil foto wajah atau pilih dari galeri untuk mendapatkan informasi dan rekomendasi.
          </p>
        </div>

        {/* Illustration area with soft blue gradient */}
        <div className="px-6 pb-32">
          <div className="rounded-2xl p-4 bg-[linear-gradient(160deg,oklch(0.98_0_230)_0%,oklch(0.96_0_230)_30%,var(--brand-blue-50)_100%)]">
            <img
              src="/images/skin-analysis-reference.png"
              alt="Contoh wajah untuk analisis kulit"
              className="mx-auto aspect-[4/5] w-[260px] rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Curved bottom plate + circular actions */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="relative h-28">
            <div className="absolute inset-0 bg-(--brand-blue-50)" />
            <div className="absolute inset-0 rounded-t-[32px] bg-(--brand-blue-100)" />
            {/* Actions */}
            <div className="absolute inset-x-0 -top-10 flex items-center justify-center gap-8">
              {/* Camera (primary pink) */}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    aria-label="Buka Kamera"
                    className="size-20 rounded-full bg-(--brand-pink) text-(--on-pink) shadow-lg grid place-items-center"
                  >
                    <Camera className="h-7 w-7" />
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

              {/* Gallery (blue) */}
              <button
                aria-label="Buka Folder"
                onClick={() => fileInputRef.current?.click()}
                className="size-16 rounded-full bg-(--brand-blue) text-(--on-blue) shadow-md grid place-items-center"
              >
                <ImageIcon className="h-6 w-6" />
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
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <div className="h-1.5 w-24 rounded-full bg-black/20" />
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
