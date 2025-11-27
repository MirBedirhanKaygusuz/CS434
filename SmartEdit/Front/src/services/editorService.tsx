const API_BASE_URL = 'http://localhost:8080';

export interface FormatResponse {
  success: boolean;
  message?: string;
  formattedText?: string;
}

// Format text (Bold, Italic, Underline)
export const formatText = async (
  text: string,
  formatType: 'bold' | 'italic' | 'underline'
): Promise<FormatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, formatType }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error formatting text:', error);
    return { success: false, message: 'Failed to format text' };
  }
};

// Get current document content
export const getDocumentContent = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/content`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error('Error getting document content:', error);
    return '';
  }
};

// Update document content
export const updateDocumentContent = async (content: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/editor/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating document content:', error);
    return false;
  }
};
