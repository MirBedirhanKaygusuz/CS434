import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type SaveFormat = 'txt' | 'md' | 'html'

interface SaveModalProps {
  isOpen: boolean
  defaultFileName: string
  onClose: () => void
  onSubmit: (payload: { fileName: string; format: SaveFormat }) => Promise<void>
}

const formats: { label: string; value: SaveFormat }[] = [
  { label: 'TXT', value: 'txt' },
  { label: 'Markdown', value: 'md' },
  { label: 'HTML', value: 'html' },
]

export default function SaveModal({ isOpen, defaultFileName, onClose, onSubmit }: SaveModalProps) {
  const [fileName, setFileName] = useState(defaultFileName)
  const [format, setFormat] = useState<SaveFormat>('txt')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFileName(defaultFileName)
      setFormat('txt')
      setError('')
    }
  }, [defaultFileName, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!fileName.trim()) {
      setError('Dosya adı boş olamaz.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      await onSubmit({ fileName: fileName.trim(), format })
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
          <h2>Dosya Kaydet</h2>
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
            Format
            <div className="format-options">
              {formats.map((item) => (
                <label key={item.value} className="format-option">
                  <input
                    type="radio"
                    name="format"
                    value={item.value}
                    checked={format === item.value}
                    onChange={() => setFormat(item.value)}
                  />
                  <span>{item.label}</span>
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
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
