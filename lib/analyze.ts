// Lightweight, on-device "analysis" using canvas metrics to produce demo results

import axios from "axios"
import type { Analysis } from "@/hooks/use-image-store"

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

  // Convert base64 to Blob
  function base64ToBlob(base64: string) {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

export async function analyzeImage(dataUrl: string): Promise<Analysis> {
  const formData = new FormData();
  const blob = base64ToBlob(dataUrl);
  formData.append("file", blob, "image.jpg");

  // Send FormData to Python API
  const { data: result } = await axios.post("https://hafiyan-skripsion.hubed.id//predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Map API response to Analysis type
  const condition = result.predicted_class || "Unknown";
  const confidence = Math.round((result.confidence ?? 0) * 100);
  const summary = `Hasil analisis: ${condition}. Confidence: ${confidence}%.`;
  const treatments: string[] = [
    "Gunakan sunscreen SPF 30+ setiap hari",
    "Jaga hidrasi kulit dan tubuh",
    "Konsultasi ke dokter kulit untuk evaluasi bila diperlukan",
  ];
  const warnings = [
    "Hasil ini bukan diagnosis medis.",
    "Selalu konsultasikan dengan tenaga kesehatan profesional untuk keputusan perawatan.",
  ];

  return { condition, confidence, summary, treatments, warnings };
}
