import type { Conversion } from '../types/conversion'

const KEY = 'appforge_conversions'

export function saveConversion(conversion: Conversion): void {
  const existing = getConversions()
  existing.unshift(conversion)
  const trimmed = existing.slice(0, 20)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
}

export function getConversions(): Conversion[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Conversion[]
  } catch {
    return []
  }
}

export function deleteConversion(id: string): void {
  const existing = getConversions()
  const filtered = existing.filter((c) => c.id !== id)
  localStorage.setItem(KEY, JSON.stringify(filtered))
}

export function clearConversions(): void {
  localStorage.removeItem(KEY)
}
