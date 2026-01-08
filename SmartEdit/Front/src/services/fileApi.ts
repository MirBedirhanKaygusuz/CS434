const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const FILE_BASE = `${API_BASE_URL}/api/file`

export type FileFormat = 'txt' | 'md' | 'html'

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

/**
 * Create new file with parent folder
 * Backend: POST /api/file/new
 * Payload: { fileName, type, parentFolder }
 * Auto-saves to directory structure
 */
export function createNewFile(payload: { fileName: string; type: FileFormat; parentFolder: string | null }) {
  return postText('/new', payload)
}

/**
 * Delete a file
 * Backend: DELETE /api/file/delete/{fileName}
 */
export async function deleteFile(fileName: string): Promise<string> {
  const response = await fetch(`${FILE_BASE}/delete/${fileName}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  const payload = await response.text()
  if (!response.ok) {
    throw new Error(payload || 'Dosya silinemedi.')
  }
  return payload
}
