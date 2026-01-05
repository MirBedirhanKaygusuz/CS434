import type { EditorResponse } from './editor'

export interface SnapshotInfo {
  id: string
  timestamp: string
  fileName: string
  preview: string
}

export interface SnapshotApi {
  list: () => Promise<SnapshotInfo[]>
  create: () => Promise<string>
  restore: (id: string) => Promise<EditorResponse>
}
