package com.smartedit.backend.patterns.memento;

import java.time.LocalDateTime;

public class SnapshotInfo {
    private String id;
    private LocalDateTime timestamp;
    private String fileName;
    private String preview;

    public SnapshotInfo(String id, LocalDateTime timestamp, String fileName, String preview) {
        this.id = id;
        this.timestamp = timestamp;
        this.fileName = fileName;
        this.preview = preview;
    }

    public String getId() {return id;}
    public LocalDateTime getTimestamp() {return timestamp;}
    public String getFileName() {return fileName;}
    public String getPreview() {return preview;}
}
