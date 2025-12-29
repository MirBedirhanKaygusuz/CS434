import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type FileType = 'txt' | 'md' | 'html'

interface NewFileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: { fileName: string; type: FileType }) => Promise<void>
}

const fileTypes: { label: string; value: FileType; description: string }[] = [
  { label: 'TXT', value: 'txt', description: 'Düz metin' },
  { label: 'Markdown', value: 'md', description: 'Markdown başlangıç şablonu' },
  { label: 'HTML', value: 'html', description: 'Basit HTML iskeleti' },
]

export default function NewFileModal({ isOpen, onClose, onSubmit }: NewFileModalProps) {
  const [fileName, setFileName] = useState('YeniNot')
  const [type, setType] = useState<FileType>('txt')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFileName('YeniNot')
      setType('txt')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!fileName.trim()) {
      setError('Dosya adı girin.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      await onSubmit({ fileName: fileName.trim(), type })
    } catch (submitError) {
      setError((submitError as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h2>Yeni Dosya</h2>
          <button type="button" className="ghost" onClick={onClose}>
            ✕
          </button>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="modal-label">
            Dosya Adı
            <input value={fileName} onChange={(event) => setFileName(event.target.value)} />
          </label>

          <label className="modal-label">
            Tür
            <div className="format-options">
              {fileTypes.map((item) => (
                <label key={item.value} className="format-option">
                  <input
                    type="radio"
                    name="file-type"
                    value={item.value}
                    checked={type === item.value}
                    onChange={() => setType(item.value)}
                  />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          <footer className="modal-footer">
            <button type="button" className="ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
