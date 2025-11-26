package com.smartedit.backend.patterns.strategy;

import java.io.FileWriter;
import java.io.IOException;

public class TextSaveStrategy implements FileSaveStrategy {
    @Override
    public void save(String fileName, String content) {
        try (FileWriter writer = new FileWriter(fileName + ".txt")) {
            writer.write(content);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }

    @Override
    public String getFileExtension() {
        return "txt";
    }
}
