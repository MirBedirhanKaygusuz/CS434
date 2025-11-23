import React, { useState, useEffect } from 'react';
import { getSnapshots, restoreSnapshot, Snapshot } from '../services/fileService';

interface RestorePointsProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
}

const RestorePoints: React.FC<RestorePointsProps> = ({ isOpen, onClose, onRestore }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSnapshots();
    }
  }, [isOpen]);

  const loadSnapshots = async () => {
    setIsLoading(true);
    try {
      const response = await getSnapshots();
      if (response.success) {
        setSnapshots(response.snapshots || []);
      } else {
        alert('Failed to load snapshots');
      }
    } catch (error) {
      console.error('Error loading snapshots:', error);
      alert('Failed to load snapshots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (snapshotId: number) => {
    if (!window.confirm('Are you sure you want to restore this version? Current content will be lost.')) {
      return;
    }

    setIsRestoring(true);
    try {
      const response = await restoreSnapshot(snapshotId);
      if (response.success) {
        // Find the snapshot content
        const snapshot = snapshots.find(s => s.id === snapshotId);
        if (snapshot) {
          onRestore(snapshot.content);
        }
        alert('Snapshot restored successfully!');
        onClose();
      } else {
        alert('Failed to restore snapshot: ' + response.message);
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('Failed to restore snapshot');
    } finally {
      setIsRestoring(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content restore-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Restore Points</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <div className="loading">Loading snapshots...</div>
          ) : snapshots.length === 0 ? (
            <div className="empty-state">
              <p>No restore points available yet.</p>
              <p className="hint">Auto-save creates restore points every 30 seconds.</p>
            </div>
          ) : (
            <div className="snapshots-list">
              {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="snapshot-item">
                  <div className="snapshot-info">
                    <div className="snapshot-timestamp">
                      {formatTimestamp(snapshot.timestamp)}
                    </div>
                    <div className="snapshot-preview">
                      {snapshot.preview || snapshot.content.substring(0, 100) + '...'}
                    </div>
                  </div>
                  <button
                    className="btn-restore"
                    onClick={() => handleRestore(snapshot.id)}
                    disabled={isRestoring}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestorePoints;
