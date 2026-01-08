import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import FolderSidebar from './FolderSidebar'
import NotesList from './NotesList'
import EditorPanel, { type EditorPanelRef } from './EditorPanel'
import AppleNotesToolbar from './AppleNotesToolbar'
import StatusBar from './StatusBar'
import SaveModal from './SaveModal'
import SnapshotModal from './SnapshotModal'
import NewFileModal from './NewFileModal'
import CreateFolderModal from './CreateFolderModal'
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
import { createDirectory } from '../services/directoryApi'
import type { EditorResponse, SelectionRange, TextFormat } from '../types/editor'

interface InlineMessage {
  type: 'success' | 'error'
  text: string
}

const DEFAULT_FILE_NAME = 'Untitled'

export default function AppLayout() {
  const editorPanelRef = useRef<EditorPanelRef>(null)
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
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [editorForceUpdate, setEditorForceUpdate] = useState(0) // Undo/Redo/Snapshot için
  const [directoryRefreshTrigger, setDirectoryRefreshTrigger] = useState(0) // Directory yenileme için

  // Apple Notes specific states
  const [selectedFolder, setSelectedFolder] = useState<string | null>('') // Başlangıçta "Tüm Notlar" seçili
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  // nota tiklandiginda icerigini yukle
  const handleNoteSelect = async (noteId: string) => {
    console.log('Not secildi:', noteId)
    setSelectedNote(noteId)
    setFileName(noteId)

    try {
      const response = await fetch('http://localhost:8080/api/file/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: noteId })
      })

      if (!response.ok) {
        throw new Error('Dosya yüklenemedi')
      }

      const data = await response.json()
      const loadedContent = data.content || ''

      console.log('Dosya yuklendi:', data.fileName)
      console.log('Icerik uzunlugu:', loadedContent.length)

      // icerigi guncelle
      setContent(loadedContent)
      setFileName(data.fileName)

      // kelime ve karakter sayisini hesapla
      const words = loadedContent.trim().split(/\s+/).filter(Boolean).length
      setWordCount(words)
      setCharCount(loadedContent.length)

      setMessage({ type: 'success', text: `${noteId} yüklendi.` })
    } catch (error) {
      console.error('Not yüklenemedi:', error)
      setMessage({ type: 'error', text: 'Not yüklenirken hata oluştu.' })
    }
  }

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

  // Otomatik dosya kaydetme - içerik değiştiğinde
  useEffect(() => {
    if (!selectedNote || !content.trim() || isLoading) {
      return
    }

    // Debounce: 2 saniye bekle, ardından kaydet
    const autoSaveTimer = window.setTimeout(async () => {
      try {
        // Dosya uzantısını çıkar
        const fileNameWithoutExt = selectedNote.replace(/\.(txt|md|html)$/, '')
        const extension = selectedNote.match(/\.(txt|md|html)$/)?.[1] as FileFormat || 'txt'

        await saveFile({
          fileName: fileNameWithoutExt,
          format: extension,
          content: content
        })

        console.log('Otomatik kaydedildi:', selectedNote)
      } catch (error) {
        console.error('Otomatik kaydetme hatası:', error)
      }
    }, 2000) // 2 saniye debounce

    return () => window.clearTimeout(autoSaveTimer)
  }, [content, selectedNote, isLoading])

  const handleSelectionChange = (range: SelectionRange) => {
    setSelection(range)
  }

  const handleSync = async (fullContent: string) => {
    // icerigi guncelle
    setContent(fullContent)

    // kelime sayisini hesapla
    const words = fullContent.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)

    // karakter sayisini guncelle
    setCharCount(fullContent.length)

    console.log('Sync yapildi - Kelime:', words, 'Karakter:', fullContent.length)
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

  const handleFormat = (format: TextFormat) => {
    // formatlama yap
    console.log('Format uygulanıyor:', format)
    editorPanelRef.current?.applyFormat(format)
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

  const handleCreateFile = async (payload: { fileName: string; type: 'txt' | 'md' | 'html'; parentFolder: string | null }) => {
    try {
      const serverMessage = await createNewFile(payload)
      const fullFileName = `${payload.fileName}.${payload.type}`
      setMessage({ type: 'success', text: serverMessage || 'Yeni dosya oluşturuldu.' })
      setFileName(fullFileName)
      setSelectedNote(fullFileName) // Yeni notu seçili yap
      setShowNewFile(false)

      // Yeni dosyayı hemen diske kaydet (boş içerikle) - böylece backend restart ettiğinde kaybolmaz
      try {
        await saveFile({
          fileName: payload.fileName,
          format: payload.type,
          content: '' // Boş içerikle kaydet
        })
        console.log('Yeni dosya storage klasörüne kaydedildi:', fullFileName)
      } catch (saveError) {
        console.error('Dosya diske kaydedilemedi:', saveError)
      }

      // Yeni dosyayı editöre yükle (boş içerikle)
      setContent('')
      setWordCount(0)
      setCharCount(0)

      // Refresh directory tree to show new file
      setDirectoryRefreshTrigger(Date.now())
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleCreateFolder = async (folderName: string, parentId: string | null) => {
    try {
      await createDirectory({ name: folderName, parentId })
      setMessage({ type: 'success', text: 'Klasör oluşturuldu.' })
      setShowCreateFolder(false)
      // Refresh directory tree to show new folder
      setDirectoryRefreshTrigger(Date.now())
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  const handleShare = () => {
    setShowSave(true)
  }

  const handleDeleteNote = (fileName: string) => {
    // If the deleted note was selected, clear selection
    if (selectedNote === fileName) {
      setSelectedNote(null)
      setFileName(DEFAULT_FILE_NAME)
      setContent('')
    }
    // Refresh directory to update the list
    setDirectoryRefreshTrigger(Date.now())
    setMessage({ type: 'success', text: 'Not silindi.' })
  }

  return (
    <div className="apple-notes-app">
      {message && (
        <div className={`apple-notification ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="apple-notes-container">
        <FolderSidebar
          selectedFolderId={selectedFolder || ''}
          onFolderSelect={setSelectedFolder}
          onCreateFolder={() => setShowCreateFolder(true)}
          refreshTrigger={directoryRefreshTrigger}
        />

        <NotesList
          selectedNoteId={selectedNote}
          onNoteSelect={handleNoteSelect}
          onNewNote={() => setShowNewFile(true)}
          selectedFolderId={selectedFolder}
          refreshTrigger={directoryRefreshTrigger}
          onDelete={handleDeleteNote}
        />

        <div className="editor-container">
          <div className="editor-header">
            <h1 className="editor-title">{selectedNote || fileName || 'Başlıksız Not'}</h1>
            <div className="editor-meta-info">
              <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <AppleNotesToolbar
            onFormat={handleFormat}
            onShare={handleShare}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSnapshot={handleCreateSnapshot}
            onOpenSnapshots={() => setShowSnapshots(true)}
          />

          <EditorPanel
            ref={editorPanelRef}
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
        currentFolderId={selectedFolder}
      />

      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onSubmit={handleCreateFolder}
          parentFolderId={selectedFolder}
        />
      )}
    </div>
  )
}
