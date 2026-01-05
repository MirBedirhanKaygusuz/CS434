import { useState, useEffect, useRef, useCallback, type SyntheticEvent } from 'react'
import type { SelectionRange } from '../types/editor'

interface EditorPanelProps {
  content: string
  loading: boolean
  selection: SelectionRange
  onSelectionChange: (range: SelectionRange) => void
  onSync: (text: string) => void
  forceUpdate?: number // Undo/Redo/Snapshot için timestamp
}

export default function EditorPanel({ content, loading, selection, onSelectionChange, onSync, forceUpdate }: EditorPanelProps) {
  const [localContent, setLocalContent] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const syncTimeoutRef = useRef<number | null>(null)

  // İlk yüklemede backend'den gelen içeriği kullan
  useEffect(() => {
    setLocalContent(content)
  }, []) // Sadece mount'ta çalış

  // forceUpdate değiştiğinde (Undo/Redo/Snapshot) backend'den gelen içeriği kullan
  useEffect(() => {
    if (forceUpdate) {
      setLocalContent(content)
    }
  }, [forceUpdate, content])

  const handleSelect = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    onSelectionChange({ start: target.selectionStart, end: target.selectionEnd })
  }

  // Debounced sync - kullanıcı yazmayı bıraktıktan 1 saniye sonra backend'e gönder
  const syncToBackend = useCallback((text: string) => {
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current)
    }

    syncTimeoutRef.current = window.setTimeout(() => {
      onSync(text)
    }, 1000)
  }, [onSync])

  const handleChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    const newText = target.value

    // LOCAL state'i HEMEN güncelle (optimistic update)
    setLocalContent(newText)

    // Backend'e debounced gönder
    syncToBackend(newText)

    // Selection'ı güncelle
    onSelectionChange({ start: target.selectionStart, end: target.selectionEnd })
  }

  // Component unmount olduğunda timeout'u temizle
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="apple-editor-panel">
      <textarea
        ref={textareaRef}
        className="apple-editor-textarea"
        value={loading ? 'Yükleniyor...' : localContent}
        readOnly={loading}
        spellCheck={false}
        placeholder="Yazmaya başlayın..."
        onClick={handleSelect}
        onSelect={handleSelect}
        onChange={handleChange}
      />
    </div>
  )
}
