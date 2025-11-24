package com.smartedit.backend.model;

public class Document {
    private String content;
    private int cursorPosition;
    private String fileName;

    public Document() {
        this.content = "";
        this.cursorPosition = 0;
        this.fileName = "Untitled";
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getCursorPosition() {
        return cursorPosition;
    }

    public void setCursorPosition(int cursorPosition) {
        this.cursorPosition = cursorPosition;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void insert(int position, String text) {
        StringBuilder sb = new StringBuilder(this.content);
        if (position > sb.length()) position = sb.length();
        sb.insert(position, text);
        this.content = sb.toString();
    }

    public void delete(int position, int length) {
        StringBuilder sb = new StringBuilder(this.content);
        if (position + length > sb.length()) return;
        sb.delete(position, position + length);
        this.content = sb.toString();
    }

    public String getText(int start, int length) {
        if (start + length > content.length()) return "";
        return content.substring(start, start + length);
    }
    
}
