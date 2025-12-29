package com.smartedit.backend.patterns.composite;

import java.util.List;

public interface FileSystemItem {
    String getName();
    
    void add(FileSystemItem item);
    void remove(FileSystemItem item);
    List<FileSystemItem> getChildren();
    
    boolean isDirectory();
}