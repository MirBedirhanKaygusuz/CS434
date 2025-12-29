interface Note {
  id: string
  title: string
  preview: string
  date: string
  isPinned?: boolean
}

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onNoteSelect: (noteId: string) => void
  onNewNote: () => void
}

export default function NotesList({ notes, selectedNoteId, onNoteSelect, onNewNote }: NotesListProps) {
  const pinnedNotes = notes.filter((note) => note.isPinned)
  const regularNotes = notes.filter((note) => !note.isPinned)

  const renderNote = (note: Note) => (
    <button
      key={note.id}
      className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
      onClick={() => onNoteSelect(note.id)}
    >
      <div className="note-item-header">
        <h3 className="note-title">{note.title || 'Başlıksız Not'}</h3>
        <span className="note-date">{note.date}</span>
      </div>
      <p className="note-preview">{note.preview}</p>
    </button>
  )

  return (
    <div className="notes-list">
      <div className="notes-list-header">
        <h2 className="notes-count">
          {notes.length} Not{notes.length !== 1 ? '' : ''}
        </h2>
        <button className="new-note-button" onClick={onNewNote} title="Yeni Not">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="notes-list-content">
        {pinnedNotes.length > 0 && (
          <>
            <div className="notes-section">
              {pinnedNotes.map(renderNote)}
            </div>
            <div className="notes-divider" />
          </>
        )}

        <div className="notes-section">
          {regularNotes.length > 0 ? (
            regularNotes.map(renderNote)
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
