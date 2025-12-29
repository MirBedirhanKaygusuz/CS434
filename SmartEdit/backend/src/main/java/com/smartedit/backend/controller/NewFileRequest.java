package com.smartedit.backend.controller;

public class NewFileRequest {
    private String fileName;
    private String type;
    private String parentFolder;

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getParentFolder() { return parentFolder; }
    public void setParentFolder(String parentFolder) { this.parentFolder = parentFolder; }
}
