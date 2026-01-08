import { useState, useEffect } from 'react'
import ThemeManager, { type Theme } from '../services/ThemeManager'

interface AppleNotesToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline') => void
  onShare: () => void
  onUndo: () => void
  onRedo: () => void
  onSnapshot: () => void
  onOpenSnapshots: () => void
}

export default function AppleNotesToolbar({ onFormat, onShare, onUndo, onRedo, onSnapshot, onOpenSnapshots }: AppleNotesToolbarProps) {
  // Use ThemeManager Singleton
  const [theme, setTheme] = useState<Theme>(() => ThemeManager.getInstance().getTheme())

  useEffect(() => {
    // Subscribe to theme changes
    const themeManager = ThemeManager.getInstance()
    const unsubscribe = themeManager.subscribe(setTheme)

    return unsubscribe
  }, [])

  const handleToggleTheme = () => {
    // Use Singleton getInstance() to toggle theme
    ThemeManager.getInstance().toggleTheme()
  }
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
        <button className="apple-toolbar-btn" onClick={handleToggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1v2M9 15v2M16 9h-2M4 9H2M14.5 3.5l-1.4 1.4M4.9 13.1l-1.4 1.4M14.5 14.5l-1.4-1.4M4.9 4.9L3.5 3.5M12 9a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15 10a6 6 0 11-9-5.2A5 5 0 009 15z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
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
