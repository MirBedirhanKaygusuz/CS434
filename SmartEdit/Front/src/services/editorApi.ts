import type { EditorResponse, TextFormat } from '../types/editor'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const EDITOR_BASE = `${API_BASE_URL}/api/editor`

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${EDITOR_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Sunucudan beklenmeyen cevap alındı.')
  }

  return response.json() as Promise<T>
}

export async function fetchEditorState(): Promise<EditorResponse> {
  const response = await fetch(`${EDITOR_BASE}/state`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Sunucudan beklenmeyen cevap alındı.')
  }

  return response.json() as Promise<EditorResponse>
}

export async function insertText(payload: { text: string; position: number }): Promise<EditorResponse> {
  return postJson<EditorResponse>('/insert', payload)
}

export async function applyFormat(payload: {
  selection: string
  format: TextFormat
  start: number
  end: number
}): Promise<EditorResponse> {
  return postJson<EditorResponse>('/format', {
    selection: payload.selection,
    format: payload.format,
    start: payload.start,
    end: payload.end,
  })
}

export async function undo(): Promise<EditorResponse> {
  return postJson<EditorResponse>('/undo')
}

export async function redo(): Promise<EditorResponse> {
  return postJson<EditorResponse>('/redo')
}

export async function syncContent(fullContent: string): Promise<EditorResponse> {
  // ReplaceTextCommand ile tüm içeriği değiştir
  // start: 0, end: çok büyük sayı → tüm dokümanı replace eder
  return postJson<EditorResponse>('/format', {
    selection: fullContent,
    format: 'bold', // Format önemli değil, sadece selection kullanılacak
    start: 0,
    end: 999999999, // Tüm dokümanı kapsayacak kadar büyük
  })
}
