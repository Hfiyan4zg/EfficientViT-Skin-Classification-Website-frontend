// Lightweight, on-device "analysis" using canvas metrics to produce demo results
import type { Analysis } from "@/hooks/use-image-store"

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export async function analyzeImage(dataUrl: string): Promise<Analysis> {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 900))

  const img = new Image()
  img.crossOrigin = "anonymous" // avoid CORS if ever used with remote images
  img.src = dataUrl

  await new Promise<void>((resolve) => {
    if (img.complete) resolve()
    img.onload = () => resolve()
  })

  // Draw to tiny canvas to compute basic brightness/contrast heuristics
  const canvas = document.createElement("canvas")
  const size = 96
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  let sum = 0
  let sumSq = 0
  const n = size * size
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    sum += lum
    sumSq += lum * lum
  }
  const mean = sum / n
  const variance = sumSq / n - mean * mean
  const contrast = Math.sqrt(Math.max(variance, 0)) // 0..~128

  // Extremely rough demo rules (not medical)
  let condition = "Healthy Skin"
  let summary = "Citra tampak normal. Hasil ini bukan diagnosis medis—hanya estimasi visual dasar."
  let treatments: string[] = [
    "Gunakan sunscreen SPF 30+ setiap hari",
    "Jaga hidrasi kulit dan tubuh",
    "Konsultasi ke dokter kulit untuk evaluasi bila diperlukan",
  ]
  let confidence = 70

  if (mean > 170 && contrast < 35) {
    condition = "Vitiligo"
    summary = "Terlihat area dengan kontras rendah dan kecerahan tinggi yang dapat menyerupai hipopigmentasi."
    treatments = [
      "Gunakan sunscreen tinggi untuk melindungi area hipopigmentasi",
      "Pertimbangkan konsultasi terapi topikal (mis. kortikosteroid/TCI)",
      "Pantau perkembangan area dan dokumentasikan foto",
    ]
    confidence = clamp(65 + (200 - mean) * 0.1)
  } else if (contrast > 60) {
    condition = "Acne / Tekstur"
    summary = "Tekstur dan kontras yang lebih tinggi dapat menandakan jerawat aktif atau pori-pori terlihat."
    treatments = [
      "Pembersih lembut 2x/hari",
      "BHA/Salicylic acid 2–3x/minggu",
      "Hindari memencet; konsultasi dengan dokter untuk terapi lanjutan",
    ]
    confidence = clamp(60 + (contrast - 60) * 0.4)
  } else if (mean < 110) {
    condition = "Melasma / Hiperpigmentasi"
    summary = "Area lebih gelap dapat menyerupai hiperpigmentasi permukaan (estimasi kasar)."
    treatments = [
      "Gunakan sunscreen spektrum luas SPF 50",
      "Pertimbangkan niacinamide/azelaic acid",
      "Konsultasi untuk evaluasi lebih lanjut",
    ]
    confidence = clamp(55 + (110 - mean) * 0.2)
  }

  const warnings = [
    "Hasil ini bukan diagnosis medis.",
    "Selalu konsultasikan dengan tenaga kesehatan profesional untuk keputusan perawatan.",
  ]

  return { condition, confidence: clamp(confidence), summary, treatments, warnings }
}
