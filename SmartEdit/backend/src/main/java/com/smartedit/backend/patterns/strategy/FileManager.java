package com.smartedit.backend.patterns.strategy;

import org.springframework.stereotype.Component;

@Component
public class FileManager {
    private FileSaveStrategy strategy;

    public void setStrategy(FileSaveStrategy strategy) {
        this.strategy = strategy;
    }

    public void saveFile(String fileName, String content) {
        if (strategy == null) {
            throw new IllegalStateException("Strategy not set");
        }
        strategy.save(fileName, content);
    }

    public String getFileExtension() {
        return strategy != null ? strategy.getFileExtension() : "";
    }
}