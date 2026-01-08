import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import type { SelectionRange } from '../types/editor'

interface EditorPanelProps {
  content: string
  loading: boolean
  selection: SelectionRange
  onSelectionChange: (range: SelectionRange) => void
  onSync: (text: string) => void
  forceUpdate?: number
}

export interface EditorPanelRef {
  applyFormat: (format: 'bold' | 'italic' | 'underline') => void
}

const EditorPanel = forwardRef<EditorPanelRef, EditorPanelProps>(
  ({ content, loading, selection, onSelectionChange, onSync, forceUpdate }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const syncTimeoutRef = useRef<number | null>(null)
    const isUpdatingRef = useRef(false)

    // html tagleri temizle
    const stripHtmlTags = (html: string): string => {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }

    // ilk yuklemede icerigi yukle
    useEffect(() => {
      console.log('Editor yuklendi')
      if (editorRef.current && !isUpdatingRef.current) {
        editorRef.current.innerHTML = content || ''
        console.log('Icerik set edildi:', content)
      }
    }, [])

    // content degistiginde guncelle
    useEffect(() => {
      if (editorRef.current && !isUpdatingRef.current) {
        const currentText = editorRef.current.innerText || ''
        const newText = stripHtmlTags(content)

        // eger icerik degistiyse guncelle
        if (currentText !== newText) {
          console.log('Icerik guncelleniyor...')
          editorRef.current.innerHTML = content || ''
        }
      }
    }, [content])

    // undo redo icin force update
    useEffect(() => {
      if (forceUpdate && editorRef.current) {
        console.log('Force update yapiliyor')
        editorRef.current.innerHTML = content || ''
      }
    }, [forceUpdate, content])

    // backend'e gonderme fonksiyonu - 1 saniye bekliyor
    const syncToBackend = useCallback(
      (html: string) => {
        if (syncTimeoutRef.current) {
          window.clearTimeout(syncTimeoutRef.current)
        }

        syncTimeoutRef.current = window.setTimeout(() => {
          // html taglerini temizle ve gonder
          const text = stripHtmlTags(html)
          console.log('Backend\'e sync yapiliyor:', text.substring(0, 50))
          onSync(text)
          isUpdatingRef.current = false
        }, 1000)
      },
      [onSync]
    )

    const handleInput = useCallback(() => {
      if (!editorRef.current) return

      isUpdatingRef.current = true
      const html = editorRef.current.innerHTML

      // backende gonder
      syncToBackend(html)
    }, [syncToBackend])

    const handleSelectionChange = useCallback(() => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return

      const range = sel.getRangeAt(0)
      onSelectionChange({
        start: range.startOffset,
        end: range.endOffset,
      })
    }, [onSelectionChange])

    // formatlama fonksiyonu
    const applyFormat = useCallback(
      (format: 'bold' | 'italic' | 'underline') => {
        if (!editorRef.current) return

        editorRef.current.focus()

        // document.execCommand ile yapioz
        if (format === 'bold') {
          document.execCommand('bold', false, undefined)
          console.log('Bold uygulandı')
        } else if (format === 'italic') {
          document.execCommand('italic', false, undefined)
          console.log('Italic uygulandı')
        } else if (format === 'underline') {
          document.execCommand('underline', false, undefined)
          console.log('Underline uygulandı')
        }

        // degisikligi kaydet
        handleInput()
      },
      [handleInput]
    )

    // ref ile parent componente gonderioz
    useImperativeHandle(
      ref,
      () => ({
        applyFormat,
      }),
      [applyFormat]
    )

    // temizlik
    useEffect(() => {
      return () => {
        if (syncTimeoutRef.current) {
          window.clearTimeout(syncTimeoutRef.current)
        }
      }
    }, [])

    if (loading) {
      return (
        <div className="apple-editor-panel">
          <div className="apple-editor-loading">Yükleniyor...</div>
        </div>
      )
    }

    return (
      <div className="apple-editor-panel">
        <div
          ref={editorRef}
          className="apple-editor-contenteditable"
          contentEditable={!loading}
          suppressContentEditableWarning
          onInput={handleInput}
          onSelect={handleSelectionChange}
          onClick={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          data-placeholder="Yazmaya başlayın..."
        />
      </div>
    )
  }
)

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel
