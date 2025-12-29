import { useEffect, useState } from 'react'
import { listSnapshots } from '../services/snapshotApi'
import type { SnapshotInfo } from '../types/snapshot'

interface SnapshotModalProps {
  isOpen: boolean
  onClose: () => void
  onRestore: (id: string) => Promise<void>
}

export default function SnapshotModal({ isOpen, onClose, onRestore }: SnapshotModalProps) {
  const [snapshots, setSnapshots] = useState<SnapshotInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [restoringId, setRestoringId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setIsLoading(true)
    setError('')
    listSnapshots()
      .then(setSnapshots)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [isOpen])

  if (!isOpen) return null

  const handleRestore = async (id: string) => {
    setRestoringId(id)
    try {
      await onRestore(id)
    } catch (restoreError) {
      setError((restoreError as Error).message)
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card large">
        <header className="modal-header">
          <h2>Snapshot Geçmişi</h2>
          <button type="button" className="ghost" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="modal-body">
          {isLoading && <p>Yükleniyor...</p>}
          {!isLoading && error && <p className="form-error">{error}</p>}
          {!isLoading && !error && snapshots.length === 0 && <p>Henüz snapshot yok.</p>}
          {!isLoading && snapshots.length > 0 && (
            <ul className="snapshot-list">
              {snapshots.map((snapshot) => (
                <li key={snapshot.id} className="snapshot-item">
                  <div>
                    <strong>{new Date(snapshot.timestamp).toLocaleString()}</strong>
                    <p className="snapshot-preview">{snapshot.preview}</p>
                    <small>{snapshot.fileName}</small>
                  </div>
                  <button
                    type="button"
                    className="primary"
                    disabled={restoringId === snapshot.id}
                    onClick={() => handleRestore(snapshot.id)}
                  >
                    {restoringId === snapshot.id ? 'Yükleniyor...' : 'Geri Yükle'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
