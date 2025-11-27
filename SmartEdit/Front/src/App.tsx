import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import SaveAs from './components/SaveAs';
import RestorePoints from './components/RestorePoints';
import AppLayout from './components/AppLayout';
import { createSnapshot } from './services/fileService';
import { createNewFile } from './services/fileService';

function App() {
  const [content, setContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const autoSaveIntervalRef = useRef<number | null>(null);

  // Auto-save functionality - every 30 seconds
  useEffect(() => {
    const handleAutoSave = async () => {
      if (content.trim()) {
        try {
          await createSnapshot(content);
          console.log('Auto-save completed');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    autoSaveIntervalRef.current = window.setInterval(handleAutoSave, 30000); // 30 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []); // Only create interval once

  // Trigger manual save when content changes significantly
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content.trim()) {
        try {
          await createSnapshot(content);
        } catch (error) {
          console.error('Manual save failed:', error);
        }
      }
    }, 5000); // Save after 5 seconds of no typing

    return () => clearTimeout(timer);
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSelectionChange = (start: number, end: number, text: string) => {
    setSelectionStart(start);
    setSelectionEnd(end);
    setSelectedText(text);
  };

  const handleFormat = (formattedText: string) => {
    // Replace selected text with formatted text
    const before = content.substring(0, selectionStart);
    const after = content.substring(selectionEnd);
    const newContent = before + formattedText + after;
    setContent(newContent);
  };

  const handleNewFile = async () => {
    if (content && !window.confirm('Create new file? Current content will be lost.')) {
      return;
    }
    
    try {
      const response = await createNewFile('text');
      if (response.success) {
        setContent('');
      }
    } catch (error) {
      console.error('Error creating new file:', error);
    }
  };

  const handleRestore = (restoredContent: string) => {
    setContent(restoredContent);
  };

  return (
    <AppLayout>
      <div className="smart-edit">
        <Header
          onNew={handleNewFile}
          onSave={() => setIsSaveAsOpen(true)}
          onRestore={() => setIsRestoreOpen(true)}
        />
        <Toolbar
          selectedText={selectedText}
          onFormat={handleFormat}
          onSave={() => setIsSaveAsOpen(true)}
          onRestore={() => setIsRestoreOpen(true)}
        />
        <Editor
          content={content}
          onChange={handleContentChange}
          onSelectionChange={handleSelectionChange}
        />
        <StatusBar content={content} />
        <SaveAs
          isOpen={isSaveAsOpen}
          onClose={() => setIsSaveAsOpen(false)}
          content={content}
        />
        <RestorePoints
          isOpen={isRestoreOpen}
          onClose={() => setIsRestoreOpen(false)}
          onRestore={handleRestore}
        />
      </div>
    </AppLayout>
  );
}

export default App;
