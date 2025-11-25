package com.smartedit.backend.patterns.memento;

import java.time.LocalDateTime;

public class DocumentMemento {
    private final String content;
    private final int cursorPosition;
    private final String fileName;
    private final LocalDateTime timestamp;

    public DocumentMemento(String content, int cursorPosition, String fileName) {
        this.content = content;
        this.cursorPosition = cursorPosition;
        this.fileName = fileName;
        this.timestamp = LocalDateTime.now();
    }

    public String getContent() {
        return content;
    }

    public int getCursorPosition() {
        return cursorPosition;
    }

    public String getFileName() {
        return fileName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
