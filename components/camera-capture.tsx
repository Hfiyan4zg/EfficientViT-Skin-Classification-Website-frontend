"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  onCapture: (dataUrl: string) => void
}

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }
      } catch (e: unknown) {
        setError("Tidak dapat mengakses kamera. Izinkan akses kamera atau gunakan unggah foto.")
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function capture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth
    const h = video.videoHeight
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    onCapture(dataUrl)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden bg-muted">
        <video ref={videoRef} className="w-full h-auto" playsInline muted />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => history.back()}>
          Tutup
        </Button>
        <Button onClick={capture} disabled={!ready}>
          Ambil Foto
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

