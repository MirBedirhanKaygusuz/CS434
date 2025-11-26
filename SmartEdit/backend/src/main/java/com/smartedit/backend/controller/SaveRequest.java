package com.smartedit.backend.controller;

public class SaveRequest {
    private String fileName;
    private String format;
    private String content;

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
