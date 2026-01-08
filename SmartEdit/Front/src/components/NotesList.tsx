import { useState, useEffect } from 'react'
import type { DirectoryNode } from '../types/directory'
import { getDirectoryTree, extractFiles } from '../services/directoryApi'
import { deleteFile } from '../services/fileApi'

interface NotesListProps {
  selectedNoteId: string | null
  onNoteSelect: (noteId: string) => void
  onNewNote: () => void
  selectedFolderId: string | null
  refreshTrigger?: number
  onDelete?: (fileName: string) => void
}

export default function NotesList({ selectedNoteId, onNoteSelect, onNewNote, selectedFolderId, refreshTrigger, onDelete }: NotesListProps) {
  const [notes, setNotes] = useState<DirectoryNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [selectedFolderId, refreshTrigger])

  const loadNotes = async () => {
    try {
      console.log('Notlar yukleniyor...')
      const tree = await getDirectoryTree()

      // klasor seciliyse o klasordeki dosyalari goster
      const filteredFiles = extractFiles(tree, selectedFolderId)
      console.log('Yuklenen not sayisi:', filteredFiles.length)
      setNotes(filteredFiles)
    } catch (error) {
      console.error('Notlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
  }

  const getPreview = (note: DirectoryNode): string => {
    // For now, just show file name
    return note.name
  }

  const handleDelete = async (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation() // not secilmesin diye

    // emin misin diye sor
    if (!confirm(`"${fileName}" dosyasını silmek istediğinize emin misiniz?`)) {
      console.log('Silme islemi iptal edildi')
      return
    }

    try {
      console.log('Dosya siliniyor:', fileName)
      await deleteFile(fileName)
      if (onDelete) {
        onDelete(fileName)
      }
      // notlari tekrar yukle
      loadNotes()
      console.log('Dosya silindi')
    } catch (error) {
      console.error('Dosya silinemedi:', error)
      alert('Dosya silinirken bir hata oluştu.')
    }
  }

  const renderNote = (note: DirectoryNode, index: number) => (
    <div
      key={`${note.name}-${index}`}
      className={`note-item ${selectedNoteId === note.name ? 'active' : ''}`}
    >
      <button
        className="note-item-content"
        onClick={() => onNoteSelect(note.name)}
      >
        <div className="note-item-header">
          <h3 className="note-title">{note.name}</h3>
          <span className="note-date">{formatDate()}</span>
        </div>
        <p className="note-preview">{getPreview(note)}</p>
      </button>
      <button
        className="note-delete-button"
        onClick={(e) => handleDelete(e, note.name)}
        title="Notu Sil"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4h10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="notes-list">
        <div className="notes-list-header">
          <h2 className="notes-count">Yükleniyor...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-list">
      <div className="notes-list-header">
        <h2 className="notes-count">
          {notes.length} Not
        </h2>
        <button className="new-note-button" onClick={onNewNote} title="Yeni Not">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="notes-list-content">
        <div className="notes-section">
          {notes.length > 0 ? (
            notes.map(renderNote)
          ) : (
            <div className="notes-empty">
              <p>Not bulunamadı</p>
              <button className="ghost" onClick={onNewNote}>
                Yeni Not Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
