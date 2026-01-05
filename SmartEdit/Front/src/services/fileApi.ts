const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const FILE_BASE = `${API_BASE_URL}/api/file`

type FileFormat = 'txt' | 'md' | 'html'

async function postText(path: string, body: unknown): Promise<string> {
  const response = await fetch(`${FILE_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.text()
  if (!response.ok) {
    throw new Error(payload || 'Dosya işlemi başarısız oldu.')
  }
  return payload
}

export function saveFile(payload: { fileName: string; format: FileFormat; content: string }) {
  return postText('/save', payload)
}

export function createNewFile(payload: { fileName: string; type: FileFormat }) {
  return postText('/new', payload)
}
