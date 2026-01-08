import { useState, type FormEvent } from 'react'

interface CreateFolderModalProps {
  onClose: () => void
  onSubmit: (folderName: string, parentId: string | null) => void
  parentFolderId?: string | null
}

export default function CreateFolderModal({ onClose, onSubmit, parentFolderId = null }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (folderName.trim()) {
      onSubmit(folderName.trim(), parentFolderId)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Klasör Oluştur</h2>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label htmlFor="folderName">Klasör Adı</label>
            <input
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Örn: İş, Kişisel, Projeler"
              autoFocus
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="ghost">
              İptal
            </button>
            <button type="submit" className="primary">
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
