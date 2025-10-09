"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useImageStore } from "@/hooks/use-image-store"
import { analyzeImage } from "@/lib/analyze"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function PreviewPage() {
  const router = useRouter()
  const { image, setAnalysis } = useImageStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!image) router.replace("/")
  }, [image, router])

  if (!image) return null

  async function handleAnalyze() {
    setLoading(true)
    try {
      const result = await analyzeImage(image as string)
      setAnalysis(result)
      router.push("/result")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center p-4 bg-[radial-gradient(900px_500px_at_85%_-10%,var(--brand-blue-50),white)]">
      <Card className="w-full max-w-[420px] p-6 space-y-4 shadow">
        {/* Title */}
        <h2 className="text-2xl font-semibold">Image Preview</h2>

        {/* Framed preview like mock (pink border, rounded) */}
        <div className="rounded-2xl border-2 border-(--brand-pink) p-3 bg-white">
          <img
            src={image || "/placeholder.svg?height=420&width=320&query=face%20photo%20preview"}
            alt="Preview wajah"
            className="mx-auto aspect-[4/5] w-full max-w-[320px] rounded-xl object-cover"
          />
        </div>

        {/* Bottom actions: Retake (neutral), Analyze (pink) */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            Retake
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-(--brand-pink) text-(--on-pink) hover:opacity-95"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menganalisis...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {/* Home bar mimic */}
        <div className="mt-2 flex justify-center">
          <div className="h-1.5 w-20 rounded-full bg-black/15" />
        </div>
      </Card>
    </main>
  )
}
