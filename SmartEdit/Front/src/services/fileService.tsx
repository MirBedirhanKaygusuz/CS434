const API_BASE_URL = 'http://localhost:8080';

export interface SaveResponse {
  success: boolean;
  message?: string;
  filename?: string;
}

export interface Snapshot {
  id: number;
  timestamp: string;
  content: string;
  preview?: string;
}

export interface SnapshotListResponse {
  success: boolean;
  snapshots: Snapshot[];
}

// Create new file
export const createNewFile = async (fileType: 'text' | 'markdown' | 'html'): Promise<SaveResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/file/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileType }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating new file:', error);
    return { success: false, message: 'Failed to create new file' };
  }
};

// Save file with format selection
export const saveFile = async (
  content: string,
  format: 'txt' | 'md' | 'html',
  filename: string
): Promise<SaveResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/file/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, format, filename }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, message: 'Failed to save file' };
  }
};

// Create snapshot (auto-save)
export const createSnapshot = async (content: string): Promise<SaveResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/snapshot/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return { success: false, message: 'Failed to create snapshot' };
  }
};

// Get list of snapshots
export const getSnapshots = async (): Promise<SnapshotListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/snapshot/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting snapshots:', error);
    return { success: false, snapshots: [] };
  }
};

// Restore snapshot
export const restoreSnapshot = async (snapshotId: number): Promise<SaveResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/snapshot/restore/${snapshotId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error restoring snapshot:', error);
    return { success: false, message: 'Failed to restore snapshot' };
  }
};
