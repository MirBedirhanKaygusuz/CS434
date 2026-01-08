import type { DirectoryTreeResponse, CreateDirectoryRequest, DirectoryNode } from '../types/directory'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const DIRECTORY_BASE = `${API_BASE_URL}/api/directory`

/**
 * Fetch the entire directory tree
 * Backend returns: [{ name, isDirectory, children }, ...]
 */
export async function getDirectoryTree(): Promise<DirectoryTreeResponse> {
  const response = await fetch(`${DIRECTORY_BASE}/tree`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Klasör ağacı alınamadı')
  }

  return response.json() as Promise<DirectoryTreeResponse>
}

// klasorleri tree'den al
export function extractFolders(nodes: DirectoryNode[]): DirectoryNode[] {
  const folders: DirectoryNode[] = []

  nodes.forEach(node => {
    if (node.isDirectory) {
      folders.push(node)
      // recursive olarak alt klasorleri de ekle
      if (node.children) {
        folders.push(...extractFolders(node.children))
      }
    }
  })

  return folders
}

// dosyalari tree'den al
export function extractFiles(nodes: DirectoryNode[], folderName?: string | null): DirectoryNode[] {
  // eger klasor secilmisse onun dosyalarini getir
  if (folderName && folderName !== '') {
    console.log('Klasor icin dosyalar yukleniyor:', folderName)
    const folder = findFolder(nodes, folderName)
    if (folder && folder.children) {
      // sadece dosyalari dondur
      return folder.children.filter(child => !child.isDirectory)
    }
    return []
  }

  // klasor secili degilse root'taki dosyalari goster
  console.log('Root dosyalar yukleniyor')
  return nodes.filter(node => !node.isDirectory)
}

// klasor bul
function findFolder(nodes: DirectoryNode[], folderName: string): DirectoryNode | null {
  for (const node of nodes) {
    if (node.isDirectory && node.name === folderName) {
      return node
    }
    // recursive arama
    if (node.children) {
      const found = findFolder(node.children, folderName)
      if (found) return found
    }
  }
  return null
}

/**
 * Create a new directory/folder
 */
export async function createDirectory(request: CreateDirectoryRequest): Promise<void> {
  const response = await fetch(`${DIRECTORY_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Klasör oluşturulamadı')
  }
}
