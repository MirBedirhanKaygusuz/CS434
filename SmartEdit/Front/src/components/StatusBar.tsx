import React, { useEffect, useState } from 'react';

interface StatusBarProps {
  content: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ content }) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<string>('');

  useEffect(() => {
    // Update character count
    setCharCount(content.length);

    // Update word count
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const updateLastSaved = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    setLastSaved(timeString);
  };

  // Expose updateLastSaved to parent via ref or callback
  useEffect(() => {
    if (content) {
      updateLastSaved();
    }
  }, [content]);

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">Words:</span>
        <span className="status-value">{wordCount}</span>
      </div>
      <div className="status-divider">|</div>
      <div className="status-item">
        <span className="status-label">Characters:</span>
        <span className="status-value">{charCount}</span>
      </div>
      {lastSaved && (
        <>
          <div className="status-divider">|</div>
          <div className="status-item">
            <span className="status-label">Last saved:</span>
            <span className="status-value">{lastSaved}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusBar;
