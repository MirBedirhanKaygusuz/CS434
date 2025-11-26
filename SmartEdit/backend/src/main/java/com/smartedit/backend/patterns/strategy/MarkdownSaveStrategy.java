package com.smartedit.backend.patterns.strategy;

import java.io.FileWriter;
import java.io.IOException;

public class MarkdownSaveStrategy implements FileSaveStrategy {
    @Override
    public void save(String fileName, String content) {
        String markdown = convertToMarkdown(content);
        try (FileWriter writer = new FileWriter(fileName + ".md")) {
            writer.write(markdown);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }

    private String convertToMarkdown(String content) {
        content = content.replaceAll("<b>(.*?)</b>", "**$1**");
        content = content.replaceAll("<i>(.*?)</i>", "*$1*");
        return content;
    }

    @Override
    public String getFileExtension() {
        return "md";
    }

}
