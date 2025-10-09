"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useImageStore } from "@/hooks/use-image-store"

export default function ResultPage() {
  const router = useRouter()
  const { image, analysis, reset } = useImageStore()

  useEffect(() => {
    if (!image || !analysis) router.replace("/")
  }, [image, analysis, router])

  if (!image || !analysis) return null

  return (
    <main className="min-h-dvh flex items-start justify-center p-4 bg-[radial-gradient(900px_500px_at_85%_-10%,var(--brand-blue-50),white)]">
      <div className="w-full max-w-[420px] space-y-4">
        <Card className="p-6 space-y-5 shadow">
          {/* Image framed in pink on top */}
          <div className="rounded-2xl border-2 border-(--brand-pink) p-3 bg-white">
            <img
              src={image || "/placeholder.svg?height=420&width=320&query=analyzed%20face%20result"}
              alt="Hasil analisis wajah"
              className="mx-auto aspect-[4/5] w-full max-w-[320px] rounded-xl object-cover"
            />
          </div>

          {/* Diagnosis content below image */}
          <section>
            <h2 className="text-2xl font-semibold">{analysis.condition}</h2>
            <p className="text-sm text-muted-foreground mt-2">{analysis.summary}</p>

            {/* Custom pink progress like mock */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Confidence</span>
                <span>{Math.round(analysis.confidence)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-(--brand-pink-10)">
                <div
                  className="h-2 rounded-full bg-(--brand-pink)"
                  style={{ width: `${Math.round(analysis.confidence)}%` }}
                />
              </div>
            </div>
          </section>


          {/* Disclaimer in soft pink with icon */}
          {analysis.warnings.length > 0 && (
            <div className="rounded-2xl border border-(--brand-pink) bg-(--brand-pink-10) p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-(--brand-pink-900) mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Medical Disclaimer</h4>
                  <p className="text-sm">{analysis.warnings.join(" ")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button variant="secondary" onClick={() => router.push("/preview")}>
              Retake
            </Button>
            <Button
              className="bg-(--brand-pink) text-(--on-pink) hover:opacity-95"
              onClick={() => {
                reset()
                router.push("/")
              }}
            >
              Home
            </Button>
          </div>

          {/* Home bar mimic */}
          <div className="flex justify-center pt-1">
            <div className="h-1.5 w-20 rounded-full bg-black/15" />
          </div>
        </Card>
      </div>
    </main>
  )
}
