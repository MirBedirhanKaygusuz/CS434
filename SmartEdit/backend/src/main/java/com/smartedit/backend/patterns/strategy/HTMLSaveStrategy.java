package com.smartedit.backend.patterns.strategy;

import java.io.FileWriter;
import java.io.IOException;

public class HTMLSaveStrategy implements FileSaveStrategy {
    @Override
    public void save(String fileName, String content) {
        String html = convertToHTML(content);
        try (FileWriter writer = new FileWriter(fileName + ".html")) {
            writer.write(html);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }

    private String convertToHTML(String content) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>\n");
        html.append("<html>\n<head>\n");
        html.append("<meta charset='UTF-8'>\n");
        html.append("<title>Document</title>\n");
        html.append("</head>\n<body>\n");
        
        String formattedContent = content.replace("\n", "<br>\n");
        html.append(formattedContent);
        
        html.append("\n</body>\n</html>");
        return html.toString();
    }

    @Override
    public String getFileExtension() {
        return "html";
    }
}