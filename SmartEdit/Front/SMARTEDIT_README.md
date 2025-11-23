# SmartEdit - Modern Text Editor

A modern, feature-rich text editor built with React and TypeScript, inspired by Apple Notes. This project demonstrates 7 design patterns in a real-world application.

## 🎯 Features

- **Auto-save** - Automatic snapshots every 30 seconds
- **Undo/Redo** - Full command history with keyboard shortcuts
- **Text Formatting** - Bold, Italic, Underline support
- **Multiple Formats** - Save as .txt, .md, or .html
- **Restore Points** - View and restore previous versions
- **Live Statistics** - Real-time word and character count
- **Apple Notes UI** - Clean, modern interface with light/dark mode

## 🎨 Screenshots

### Main Interface
![SmartEdit Interface](https://github.com/user-attachments/assets/6350b696-5f98-4fe0-a257-bd2fda0d0899)

### Active Editing
![With Content](https://github.com/user-attachments/assets/c5e629ed-3069-4a26-98f1-cd29ffa8a14c)

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Port: 3000
- Pure UI layer - no business logic
- API integration for all operations

### Backend (Java Spring Boot)
- Port: 8080
- All design patterns implemented
- Complete business logic

## 🎯 Design Patterns

### 1. Command Pattern - Undo/Redo
- `InsertTextCommand`, `DeleteTextCommand`, `ReplaceTextCommand`
- `CommandManager` for history management
- Endpoints: `/api/editor/insert`, `/api/editor/undo`, `/api/editor/redo`

### 2. Memento Pattern - Auto-save & Restore
- `DocumentMemento` for snapshots
- `MementoManager` for snapshot management
- Endpoints: `/api/snapshot/create`, `/api/snapshot/list`, `/api/snapshot/restore/{id}`
- Auto-save every 30 seconds

### 3. Strategy Pattern - Save Formats
- `TextSaveStrategy` (.txt)
- `MarkdownSaveStrategy` (.md)
- `HTMLSaveStrategy` (.html)
- Endpoint: `/api/file/save`

### 4. Observer Pattern - Status Updates
- `StatusBarObserver` for word/character count
- `AutoSaveObserver` for save triggers
- Real-time updates on content change

### 5. Singleton Pattern - Editor Manager
- `EditorManager.getInstance()`
- Central management of all managers

### 6. Factory Method - New Files
- `TextDocumentFactory`
- `MarkdownDocumentFactory`
- `HTMLDocumentFactory`
- Endpoint: `/api/file/new`

### 7. Decorator Pattern - Text Formatting
- `BoldDecorator`, `ItalicDecorator`, `UnderlineDecorator`
- Endpoint: `/api/editor/format`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven (for backend)

### Frontend Setup
```bash
cd SmartEdit/Front
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
npm run preview  # Preview production build
```

## 📁 Project Structure

```
SmartEdit/Front/
├── src/
│   ├── components/        # UI Components
│   │   ├── Header.tsx     # Top navigation
│   │   ├── Editor.tsx     # Main editor with undo/redo
│   │   ├── Toolbar.tsx    # Formatting toolbar
│   │   ├── StatusBar.tsx  # Live statistics
│   │   ├── SaveAs.tsx     # Save modal
│   │   └── RestorePoints.tsx  # Restore modal
│   ├── services/          # API Integration
│   │   ├── commandService.tsx   # Command pattern
│   │   ├── editorService.tsx    # Formatting
│   │   └── fileService.tsx      # File operations
│   ├── App.tsx           # Main application
│   └── App.css           # Styling
├── package.json
└── vite.config.js
```

## ⌨️ Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo
- `Ctrl+Y` / `Cmd+Y` - Redo (alternative)

## 🎨 UI Components

### Header
- Application title with branding
- New, Save As, Restore Points buttons

### Editor
- Main textarea for content
- Undo/Redo buttons
- Text selection tracking

### Toolbar
- Bold, Italic, Underline formatting
- Quick save and restore access
- Disabled state management

### Status Bar
- Live word count
- Live character count
- Last saved timestamp
- Optimized with memoization

### Modals
- **Save As**: Choose filename and format
- **Restore Points**: Browse and restore snapshots

## 🔧 API Endpoints

All endpoints expect backend at `http://localhost:8080`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/editor/insert` | Insert text |
| POST | `/api/editor/undo` | Undo action |
| POST | `/api/editor/redo` | Redo action |
| POST | `/api/editor/format` | Format text |
| POST | `/api/file/new` | Create new file |
| POST | `/api/file/save` | Save file |
| POST | `/api/snapshot/create` | Create snapshot |
| GET | `/api/snapshot/list` | List snapshots |
| POST | `/api/snapshot/restore/{id}` | Restore snapshot |

## 🎨 Design System

### Colors
- Uses CSS custom properties
- Automatic light/dark mode
- System font stack for performance

### Typography
- System fonts: -apple-system, BlinkMacSystemFont, Segoe UI
- Consistent sizing and spacing
- Professional hierarchy

### Components
- Rounded corners (6px radius)
- Subtle shadows for depth
- Smooth transitions (0.2s)
- Accessible focus states

## 🧪 Testing

```bash
npm run lint    # ESLint checks
npm run build   # Build verification
```

## 📝 Development Notes

- **Frontend only** - Backend implemented separately
- **Type safety** - Full TypeScript coverage
- **Error handling** - Graceful degradation
- **Performance** - Memoization and debouncing
- **Accessibility** - ARIA labels and keyboard navigation

## 🔐 Security

- CodeQL scanning: 0 vulnerabilities
- No external dependencies for core functionality
- Proper error boundaries
- Input validation

## 🤝 Contributing

This is an educational project demonstrating design patterns. Feel free to use it as a reference for learning.

## 📄 License

Educational project - MIT License

## 👨‍💻 Author

Implementation for CS434 course project

---

**Note**: This is the frontend portion. The backend (Java Spring Boot) must be running on port 8080 for full functionality.
