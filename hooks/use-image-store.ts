// Simple client-side store for sharing image and analysis across pages
"use client"

import { create } from "zustand"

export type Analysis = {
  condition: string
  confidence: number // 0-100
  summary: string
  treatments: string[]
  warnings: string[]
}

type Store = {
  image: string | null
  analysis: Analysis | null
  setImage: (dataUrl: string) => void
  setAnalysis: (a: Analysis) => void
  reset: () => void
}

export const useImageStore = create<Store>((set) => ({
  image: null,
  analysis: null,
  setImage: (dataUrl) => set({ image: dataUrl, analysis: null }),
  setAnalysis: (a) => set({ analysis: a }),
  reset: () => set({ image: null, analysis: null }),
}))

