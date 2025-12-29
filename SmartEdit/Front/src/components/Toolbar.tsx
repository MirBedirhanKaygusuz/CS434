import type { KeyboardEvent } from 'react'
import type { SelectionRange, TextFormat } from '../types/editor'

interface ToolbarProps {
  pendingText: string
  onPendingTextChange: (value: string) => void
  onInsert: () => void
  disableInsert: boolean
  onFormat: (format: TextFormat) => void
  disableFormat: boolean
  onUndo: () => void
  onRedo: () => void
  onSnapshot: () => void
  onOpenRestore: () => void
  selectionRange: SelectionRange
}

const formatButtons: { label: string; format: TextFormat }[] = [
  { label: 'Kalın', format: 'bold' },
  { label: 'İtalik', format: 'italic' },
  { label: 'Altı Çizili', format: 'underline' },
]

export default function Toolbar(props: ToolbarProps) {
  const {
    pendingText,
    onPendingTextChange,
    onInsert,
    disableInsert,
    onFormat,
    disableFormat,
    onUndo,
    onRedo,
    onSnapshot,
    onOpenRestore,
    selectionRange,
  } = props

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !disableInsert) {
      onInsert()
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-section grow">
        <label className="toolbar-label">Metin Ekle</label>
        <div className="toolbar-inline">
          <input
            type="text"
            value={pendingText}
            onChange={(event) => onPendingTextChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Eklenecek metni yazın"
          />
          <button type="button" onClick={onInsert} disabled={disableInsert}>
            Ekle
          </button>
        </div>
        <small className="toolbar-hint">Konum: {selectionRange.start}</small>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">Format</label>
        <div className="toolbar-inline">
          {formatButtons.map((button) => (
            <button
              key={button.format}
              type="button"
              onClick={() => onFormat(button.format)}
              disabled={disableFormat}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">Komutlar</label>
        <div className="toolbar-inline">
          <button type="button" onClick={onUndo}>
            Geri Al
          </button>
          <button type="button" onClick={onRedo}>
            Yinele
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">Snapshot</label>
        <div className="toolbar-inline">
          <button type="button" onClick={onSnapshot}>
            Oluştur
          </button>
          <button type="button" onClick={onOpenRestore}>
            Listele
          </button>
        </div>
      </div>
    </div>
  )
}
