interface HeaderProps {
  fileName: string
  onSaveClick: () => void
  onNewFileClick: () => void
  onRefreshClick: () => void
}

export default function Header({ fileName, onSaveClick, onNewFileClick, onRefreshClick }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div>
          <p className="header-title">📝 SmartEdit</p>
          <p className="file-pill" title={fileName}>
            {fileName || 'Untitled'}
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost" onClick={onRefreshClick}>
            Senkronize Et
          </button>
          <button type="button" className="ghost" onClick={onNewFileClick}>
            Yeni Dosya
          </button>
          <button type="button" className="primary" onClick={onSaveClick}>
            Kaydet
          </button>
        </div>
      </div>
    </header>
  )
}
