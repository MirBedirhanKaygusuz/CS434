package com.smartedit.backend.patterns.strategy;

public interface FileSaveStrategy {
    void save(String filename, String content);
    String getFileExtension();
}
