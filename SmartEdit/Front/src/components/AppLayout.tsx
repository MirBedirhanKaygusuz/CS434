import { useCallback, useEffect, useMemo, useState } from 'react'
import FolderSidebar from './FolderSidebar'
import NotesList from './NotesList'
import EditorPanel from './EditorPanel'
import AppleNotesToolbar from './AppleNotesToolbar'
import StatusBar from './StatusBar'
import SaveModal from './SaveModal'
import SnapshotModal from './SnapshotModal'
import NewFileModal from './NewFileModal'
import {
  applyFormat,
  fetchEditorState,
  insertText,
  redo,
  undo,
  syncContent,
} from '../services/editorApi'
import { saveFile, createNewFile } from '../services/fileApi'
import { createSnapshot, restoreSnapshot } from '../services/snapshotApi'
import type { EditorResponse, SelectionRange, TextFormat } from '../types/editor'

interface InlineMessage {
  type: 'success' | 'error'
  text: string
}

const DEFAULT_FILE_NAME = 'Untitled'

export default function AppLayout() {
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME)
  const [selection, setSelection] = useState<SelectionRange>({ start: 0, end: 0 })
  const [pendingText, setPendingText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<InlineMessage | null>(null)
  const [showSave, setShowSave] = useState(false)
  const [showSnapshots, setShowSnapshots] = useState(false)
  const [showNewFile, setShowNewFile] = useState(false)
  const [editorForceUpdate, setEditorForceUpdate] = useState(0) // Undo/Redo/Snapshot için

  // Apple Notes specific states
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedNote, setSelectedNote] = useState<string | null>('note-1')
  const [notes] = useState([
    {
      id: 'note-1',
      title: 'Hoş Geldiniz',
      preview: 'Apple Notes benzeri arayüzünüze hoş geldiniz. Buradan notlarınızı oluşturabilir ve düzenleyebilirsiniz.',
      date: 'Bugün 14:30',
      isPinned: true,
    },
    {
      id: 'note-2',
      title: 'Proje Notları',
      preview: 'Yeni özellikler: Üç sütunlu hiyerarşi, klasör yönetimi, gelişmiş araç çubuğu...',
      date: 'Dün',
      isPinned: false,
    },
    {
      id: 'note-3',
      title: 'Yapılacaklar',
      preview: 'Design Pattern implementasyonu, UI geliştirmeleri, test senaryoları...',
      date: '2 gün önce',
      isPinned: false,
    },
  ])

  const applyEditorResponse = useCallback((response: EditorResponse) => {
    const nextContent = response.content ?? ''
    setContent(nextContent)
    setWordCount(response.wordCount ?? 0)
    setCharCount(response.charCount ?? nextContent.length)
    setSelection((current) => ({
      start: Math.min(current.start, nextContent.length),
      end: Math.min(current.end, nextContent.length),
    }))
  }, [])

  const loadEditor = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchEditorState()
      applyEditorResponse(data)
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }, [applyEditorResponse])

  useEffect(() => {
    loadEditor()
  }, [loadEditor])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(null), 4000)
    return () => window.clearTimeout(timer)
  }, [message])

  // Otomatik snapshot - her 30 saniyede bir
  useEffect(() => {
    const autoSnapshotInterval = window.setInterval(async () => {
      if (!isLoading && content.trim().length > 0) {
        try {
          await createSnapshot()
          console.log('Otomatik snapshot oluşturuldu')
        } catch (error) {
          console.error('Otomatik snapshot hatası:', error)
        }
      }
    }, 30000) // 30 saniye

    return () => window.clearInterval(autoSnapshotInterval)
  }, [content, isLoading])

  const handleSelectionChange = (range: SelectionRange) => {
    setSelection(range)
  }

  const handleSync = async (fullContent: string) => {
    try {
      const response = await syncContent(fullContent)
      // SADECE word/char count'u güncelle, content'i DEĞİŞTİRME!
      // Local content zaten doğru, backend'in eski response'u ile override etme
      setWordCount(response.wordCount ?? 0)
      setCharCount(response.charCount ?? fullContent.length)
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Senkronizasyon hatası.' })
    }
  }

  const handleInsert = async () => {
    const text = pendingText
    if (!text.trim()) return

    try {
      const position = Math.min(selection.start, content.length)
      const response = await insertText({ text, position })
      applyEditorResponse(response)
      const nextPosition = position + text.length
      setSelection({ start: nextPosition, end: nextPosition })
      setPendingText('')
      setMessage({ type: 'success', text: 'Metin eklendi.' })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const selectionLength = useMemo(() => Math.max(selection.end - selection.start, 0), [selection])

  const handleFormat = async (format: TextFormat) => {
    if (selectionLength === 0) {
      setMessage({ type: 'error', text: 'Lütfen formatlamak için metin seçin.' })
      return
    }

    const selectedText = content.substring(selection.start, selection.end)

    try {
      const response = await applyFormat({
        selection: selectedText,
        format,
        start: selection.start,
        end: selection.end,
      })
      applyEditorResponse(response)
      setMessage({ type: 'success', text: 'Format uygulandı.' })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleUndo = async () => {
    try {
      const response = await undo()
      applyEditorResponse(response)
      setEditorForceUpdate(Date.now()) // EditorPanel'i zorla güncelle
      setMessage({ type: 'success', text: 'Geri alma uygulandı.' })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleRedo = async () => {
    try {
      const response = await redo()
      applyEditorResponse(response)
      setEditorForceUpdate(Date.now()) // EditorPanel'i zorla güncelle
      setMessage({ type: 'success', text: 'Yineleme uygulandı.' })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleCreateSnapshot = async () => {
    try {
      const id = await createSnapshot()
      setMessage({ type: 'success', text: `Snapshot kaydedildi (${id.slice(0, 8)}...).` })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleRestoreSnapshot = async (snapshotId: string) => {
    try {
      const response = await restoreSnapshot(snapshotId)
      applyEditorResponse(response)
      setEditorForceUpdate(Date.now()) // EditorPanel'i zorla güncelle
      setMessage({ type: 'success', text: 'Snapshot geri yüklendi.' })
      setShowSnapshots(false)
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleSaveFile = async (payload: { fileName: string; format: 'txt' | 'md' | 'html' }) => {
    try {
      const message = await saveFile({ ...payload, content })
      setMessage({ type: 'success', text: message || 'Dosya kaydedildi.' })
      setShowSave(false)
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleCreateFile = async (payload: { fileName: string; type: 'txt' | 'md' | 'html' }) => {
    try {
      const serverMessage = await createNewFile(payload)
      setMessage({ type: 'success', text: serverMessage || 'Yeni dosya oluşturuldu.' })
      setFileName(`${payload.fileName}.${payload.type}`)
      setShowNewFile(false)
      await loadEditor()
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleToolbarAction = (action: 'checklist' | 'table' | 'photo' | 'drawing') => {
    setMessage({ type: 'success', text: `${action} özelliği yakında eklenecek.` })
  }

  const handleShare = () => {
    setShowSave(true)
  }

  return (
    <div className="apple-notes-app">
      {message && (
        <div className={`apple-notification ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="apple-notes-container">
        <FolderSidebar selectedFolderId={selectedFolder} onFolderSelect={setSelectedFolder} />

        <NotesList
          notes={notes}
          selectedNoteId={selectedNote}
          onNoteSelect={setSelectedNote}
          onNewNote={() => setShowNewFile(true)}
        />

        <div className="editor-container">
          <div className="editor-header">
            <h1 className="editor-title">{notes.find((n) => n.id === selectedNote)?.title || 'Başlıksız Not'}</h1>
            <div className="editor-meta-info">
              <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <AppleNotesToolbar
            onFormat={handleFormat}
            onAction={handleToolbarAction}
            onShare={handleShare}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSnapshot={handleCreateSnapshot}
            onOpenSnapshots={() => setShowSnapshots(true)}
          />

          <EditorPanel
            content={content}
            loading={isLoading}
            onSelectionChange={handleSelectionChange}
            onSync={handleSync}
            selection={selection}
            forceUpdate={editorForceUpdate}
          />

          <StatusBar wordCount={wordCount} charCount={charCount} selectionLength={selectionLength} />
        </div>
      </div>

      <SaveModal
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        defaultFileName={fileName.replace(/\.[^.]+$/, '')}
        onSubmit={handleSaveFile}
      />

      <SnapshotModal
        isOpen={showSnapshots}
        onClose={() => setShowSnapshots(false)}
        onRestore={handleRestoreSnapshot}
      />

      <NewFileModal
        isOpen={showNewFile}
        onClose={() => setShowNewFile(false)}
        onSubmit={handleCreateFile}
      />
    </div>
  )
}
