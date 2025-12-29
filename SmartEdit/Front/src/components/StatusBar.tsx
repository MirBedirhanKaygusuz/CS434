interface StatusBarProps {
  wordCount: number
  charCount: number
  selectionLength: number
}

export default function StatusBar({ wordCount, charCount, selectionLength }: StatusBarProps) {
  return (
    <footer className="status-bar">
      <div className="status-item">
        <span className="status-label">Kelime</span>
        <span className="status-value">{wordCount}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Karakter</span>
        <span className="status-value">{charCount}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Seçim</span>
        <span className="status-value">{selectionLength}</span>
      </div>
    </footer>
  )
}
