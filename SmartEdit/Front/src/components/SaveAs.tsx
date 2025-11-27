import React, { useState } from 'react';
import { saveFile } from '../services/fileService';

interface SaveAsProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const SaveAs: React.FC<SaveAsProps> = ({ isOpen, onClose, content }) => {
  const [filename, setFilename] = useState('document');
  const [format, setFormat] = useState<'txt' | 'md' | 'html'>('txt');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!filename.trim()) {
      alert('Please enter a filename');
      return;
    }

    setIsSaving(true);
    try {
      const response = await saveFile(content, format, filename);
      if (response.success) {
        alert(`File saved successfully: ${response.filename || filename}.${format}`);
        onClose();
      } else {
        alert('Failed to save file: ' + response.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Save As</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="filename">Filename:</label>
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Format:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="txt"
                  checked={format === 'txt'}
                  onChange={(e) => setFormat(e.target.value as 'txt')}
                />
                <span>.txt (Plain Text)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="md"
                  checked={format === 'md'}
                  onChange={(e) => setFormat(e.target.value as 'md')}
                />
                <span>.md (Markdown)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="html"
                  checked={format === 'html'}
                  onChange={(e) => setFormat(e.target.value as 'html')}
                />
                <span>.html (HTML)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveAs;
