import React, { useState, useEffect, useMemo } from 'react';

interface StatusBarProps {
  content: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ content }) => {
  const [lastSaved, setLastSaved] = useState<string>('');

  // Memoize word and character count to avoid recalculating on every render
  const charCount = useMemo(() => content.length, [content]);
  
  const wordCount = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }, [content]);

  useEffect(() => {
    // Only update last saved timestamp when content actually changes
    if (content) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLastSaved(timeString);
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
