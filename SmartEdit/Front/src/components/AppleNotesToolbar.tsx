interface AppleNotesToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline') => void
  onAction: (action: 'checklist' | 'table' | 'photo' | 'drawing') => void
  onShare: () => void
  onUndo: () => void
  onRedo: () => void
  onSnapshot: () => void
  onOpenSnapshots: () => void
}

export default function AppleNotesToolbar({ onFormat, onAction, onShare, onUndo, onRedo, onSnapshot, onOpenSnapshots }: AppleNotesToolbarProps) {
  return (
    <div className="apple-toolbar">
      <div className="apple-toolbar-group">
        <button className="apple-toolbar-btn" onClick={() => onFormat('bold')} title="Kalın">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 3h6a3 3 0 010 6H4V3zm0 6h7a3.5 3.5 0 010 7H4V9z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={() => onFormat('italic')} title="İtalik">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 3h7M4 15h7M11 3l-4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={() => onFormat('underline')} title="Altı Çizili">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 3v6a5 5 0 0010 0V3M3 15h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="apple-toolbar-divider" />

      <div className="apple-toolbar-group">
        <button className="apple-toolbar-btn" onClick={() => onAction('checklist')} title="Kontrol Listesi">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="5" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 5h6M10 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={() => onAction('table')} title="Tablo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="3" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={() => onAction('photo')} title="Fotoğraf">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6.5" cy="7.5" r="1.5" fill="currentColor" />
            <path d="M16 11l-3.5-3.5-3 3-2-2L2 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={() => onAction('drawing')} title="Çizim">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M13.5 2.5l2 2-9 9-3 1 1-3 9-9z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="apple-toolbar-spacer" />

      <div className="apple-toolbar-group">
        <button className="apple-toolbar-btn" onClick={onUndo} title="Geri Al">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 8h8a4 4 0 010 8H9M4 8l3-3M4 8l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={onRedo} title="İleri Al">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M14 8H6a4 4 0 000 8h3M14 8l-3-3M14 8l-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="apple-toolbar-divider" />

      <div className="apple-toolbar-group">
        <button className="apple-toolbar-btn" onClick={onSnapshot} title="Snapshot Oluştur">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="apple-toolbar-btn" onClick={onOpenSnapshots} title="Snapshot Listesi">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 7h4M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="apple-toolbar-divider" />

      <div className="apple-toolbar-group">
        <button className="apple-toolbar-btn apple-toolbar-share" onClick={onShare} title="Kaydet">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 3v9M9 3L6 6M9 3l3 3M4 12v2a1 1 0 001 1h8a1 1 0 001-1v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
