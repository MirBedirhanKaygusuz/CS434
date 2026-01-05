package com.smartedit.backend.patterns.strategy;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class TextSaveStrategy implements FileSaveStrategy {
    private final String STORAGE_DIR = "storage/";

    @Override
    public void save(String fileName, String content) {
        new File(STORAGE_DIR).mkdirs(); 
        
        try (FileWriter writer = new FileWriter(STORAGE_DIR + fileName + ".txt")) {
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
