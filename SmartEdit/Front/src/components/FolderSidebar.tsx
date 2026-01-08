import { useState, useEffect } from 'react'
import type { DirectoryNode } from '../types/directory'
import { getDirectoryTree, extractFolders } from '../services/directoryApi'

interface FolderSidebarProps {
  onFolderSelect: (folderId: string) => void
  selectedFolderId: string
  onCreateFolder: () => void
  refreshTrigger?: number
}

export default function FolderSidebar({ onFolderSelect, selectedFolderId, onCreateFolder, refreshTrigger }: FolderSidebarProps) {
  const [folders, setFolders] = useState<DirectoryNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDirectoryTree()
  }, [refreshTrigger])

  const loadDirectoryTree = async () => {
    try {
      console.log('Klasorler yukleniyor...')
      const tree = await getDirectoryTree()
      const folderList = extractFolders(tree)
      console.log('Bulunan klasor sayisi:', folderList.length)
      setFolders(folderList)
    } catch (error) {
      console.error('Directory tree yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFolderIcon = (folder: DirectoryNode): string => {
    const name = folder.name.toLowerCase()
    if (name.includes('iş') || name.includes('work')) return '💼'
    if (name.includes('kişisel') || name.includes('personal')) return '🏠'
    if (name.includes('fikir') || name.includes('idea')) return '💡'
    if (name.includes('proje') || name.includes('project')) return '🚀'
    return '📂'
  }

  if (loading) {
    return (
      <aside className="folder-sidebar">
        <div className="folder-loading">Klasörler yükleniyor...</div>
      </aside>
    )
  }

  return (
    <aside className="folder-sidebar">
      <div className="folder-header">
        <h2 className="folder-title">Klasörler</h2>
        <button className="icon-button" onClick={onCreateFolder} title="Yeni Klasör">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="folder-section">
        <div className="folder-section-title">Notlarım</div>

        {/* Tüm Notlar / Klasörsüz Notlar */}
        <button
          className={`folder-item ${selectedFolderId === '' ? 'active' : ''}`}
          onClick={() => onFolderSelect('')}
        >
          <span className="folder-icon">📝</span>
          <span className="folder-name">Tüm Notlar</span>
        </button>

        {/* Klasörler */}
        {folders.map((folder, index) => (
          <button
            key={`${folder.name}-${index}`}
            className={`folder-item ${selectedFolderId === folder.name ? 'active' : ''}`}
            onClick={() => onFolderSelect(folder.name)}
          >
            <span className="folder-icon">{getFolderIcon(folder)}</span>
            <span className="folder-name">{folder.name}</span>
          </button>
        ))}

        {folders.length === 0 && (
          <div className="folder-empty-hint">
            Klasör oluşturmak için + butonuna tıklayın
          </div>
        )}
      </div>
    </aside>
  )
}
