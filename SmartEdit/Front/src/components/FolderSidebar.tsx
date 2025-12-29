import { useState } from 'react'

interface Folder {
  id: string
  name: string
  icon: string
  type: 'default' | 'user'
}

interface FolderSidebarProps {
  onFolderSelect: (folderId: string) => void
  selectedFolderId: string
}

const defaultFolders: Folder[] = [
  { id: 'all', name: 'Tüm Notlar', icon: '📋', type: 'default' },
  { id: 'recent', name: 'Son Notlar', icon: '🕐', type: 'default' },
]

export default function FolderSidebar({ onFolderSelect, selectedFolderId }: FolderSidebarProps) {
  const [userFolders] = useState<Folder[]>([
    { id: 'work', name: 'İş', icon: '💼', type: 'user' },
    { id: 'personal', name: 'Kişisel', icon: '🏠', type: 'user' },
    { id: 'ideas', name: 'Fikirler', icon: '💡', type: 'user' },
  ])

  return (
    <aside className="folder-sidebar">
      <div className="folder-header">
        <h2 className="folder-title">Klasörler</h2>
        <button className="icon-button" title="Yeni Klasör">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="folder-section">
        <div className="folder-section-title">iCloud</div>
        {defaultFolders.map((folder) => (
          <button
            key={folder.id}
            className={`folder-item ${selectedFolderId === folder.id ? 'active' : ''}`}
            onClick={() => onFolderSelect(folder.id)}
          >
            <span className="folder-icon">{folder.icon}</span>
            <span className="folder-name">{folder.name}</span>
          </button>
        ))}
      </div>

      <div className="folder-section">
        <div className="folder-section-title">Klasörlerim</div>
        {userFolders.map((folder) => (
          <button
            key={folder.id}
            className={`folder-item ${selectedFolderId === folder.id ? 'active' : ''}`}
            onClick={() => onFolderSelect(folder.id)}
          >
            <span className="folder-icon">{folder.icon}</span>
            <span className="folder-name">{folder.name}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
