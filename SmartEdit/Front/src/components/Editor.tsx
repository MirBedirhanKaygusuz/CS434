import React, { useState, useEffect, useRef } from 'react';
import { undo, redo } from '../services/commandService';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onSelectionChange?: (start: number, end: number, selectedText: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, onSelectionChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleUndo = async () => {
    try {
      const response = await undo();
      if (response.success && response.content !== undefined) {
        onChange(response.content);
      }
    } catch (error) {
      console.error('Undo failed:', error);
    }
  };

  const handleRedo = async () => {
    try {
      const response = await redo();
      if (response.success && response.content !== undefined) {
        onChange(response.content);
      }
    } catch (error) {
      console.error('Redo failed:', error);
    }
  };

  const handleSelectionChange = () => {
    if (textareaRef.current && onSelectionChange) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      onSelectionChange(start, end, selectedText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Ctrl+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }
    // Handle Ctrl+Shift+Z or Ctrl+Y for redo
    if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) || 
        ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      e.preventDefault();
      handleRedo();
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button 
          className="editor-btn" 
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button 
          className="editor-btn" 
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelectionChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing..."
        spellCheck={true}
      />
    </div>
  );
};

export default Editor;
