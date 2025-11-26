package com.smartedit.backend.controller;

public class EditorResponse {
    private String content;
    private boolean success;
    private int wordCount;
    private int charCount;

    public EditorResponse(String content, boolean success) {
        this(content, success, 0, 0);
    }

    public EditorResponse(String content, boolean success, int wordCount, int charCount) {
        this.content = content;
        this.success = success;
        this.wordCount = wordCount;
        this.charCount = charCount;
    }

    public String getContent() { return content; }
    public boolean isSuccess() { return success; }
    public int getWordCount() { return wordCount; }
    public int getCharCount() { return charCount; }
}