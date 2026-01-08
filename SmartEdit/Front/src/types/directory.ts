// Backend response format
export interface DirectoryNode {
  name: string
  isDirectory: boolean
  children: DirectoryNode[] | null
}

export interface CreateDirectoryRequest {
  name: string
  parentId: string | null
}

// Backend returns array directly
export type DirectoryTreeResponse = DirectoryNode[]
