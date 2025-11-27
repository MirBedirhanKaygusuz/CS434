import React from 'react';
import { formatText } from '../services/editorService';

interface ToolbarProps {
  selectedText: string;
  onFormat: (formattedText: string) => void;
  onSave: () => void;
  onRestore: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedText, onFormat, onSave, onRestore }) => {
  const handleFormat = async (formatType: 'bold' | 'italic' | 'underline') => {
    if (!selectedText) {
      alert('Please select text to format');
      return;
    }
    
    try {
      const response = await formatText(selectedText, formatType);
      if (response.success && response.formattedText) {
        onFormat(response.formattedText);
      } else {
        alert('Failed to format text: ' + response.message);
      }
    } catch (error) {
      console.error('Format error:', error);
      alert('Failed to format text');
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('bold')}
          title="Bold"
          disabled={!selectedText}
        >
          <strong>B</strong>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('italic')}
          title="Italic"
          disabled={!selectedText}
        >
          <em>I</em>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('underline')}
          title="Underline"
          disabled={!selectedText}
        >
          <u>U</u>
        </button>
      </div>
      <div className="toolbar-divider"></div>
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onSave} title="Save As">
          💾 Save
        </button>
        <button className="toolbar-btn" onClick={onRestore} title="Restore Points">
          🕐 Restore
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
