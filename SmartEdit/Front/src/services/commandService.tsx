const API_BASE_URL = 'http://localhost:8080';

export interface CommandResponse {
  success: boolean;
  message?: string;
  content?: string;
}

// Insert text command
export const insertText = async (text: string, position: number): Promise<CommandResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, position }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error inserting text:', error);
    return { success: false, message: 'Failed to insert text' };
  }
};

// Undo command
export const undo = async (): Promise<CommandResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/undo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error undoing:', error);
    return { success: false, message: 'Failed to undo' };
  }
};

// Redo command
export const redo = async (): Promise<CommandResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/redo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error redoing:', error);
    return { success: false, message: 'Failed to redo' };
  }
};
