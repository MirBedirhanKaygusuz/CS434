package com.smartedit.backend.controller;

public class EditorResponse {
    private String content;
    private boolean success;

    public EditorResponse(String content, boolean success) {
        this.content = content;
        this.success = success;
    }

    public String getContent() { return content; }
    public boolean isSuccess() { return success; }
}