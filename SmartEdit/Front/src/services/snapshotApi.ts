import type { EditorResponse } from '../types/editor'
import type { SnapshotInfo } from '../types/snapshot'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const SNAPSHOT_BASE = `${API_BASE_URL}/api/snapshot`

async function ensureOk(response: Response): Promise<Response> {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Snapshot isteği başarısız oldu.')
  }
  return response
}

export async function createSnapshot(): Promise<string> {
  const response = await ensureOk(
    await fetch(`${SNAPSHOT_BASE}/create`, {
      method: 'POST',
    }),
  )

  return response.text()
}

export async function listSnapshots(): Promise<SnapshotInfo[]> {
  const response = await ensureOk(await fetch(`${SNAPSHOT_BASE}/list`))
  return response.json() as Promise<SnapshotInfo[]>
}

export async function restoreSnapshot(id: string): Promise<EditorResponse> {
  const response = await ensureOk(
    await fetch(`${SNAPSHOT_BASE}/restore/${id}`, {
      method: 'POST',
    }),
  )

  return response.json() as Promise<EditorResponse>
}
