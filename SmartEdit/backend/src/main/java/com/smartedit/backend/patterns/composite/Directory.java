package com.smartedit.backend.patterns.composite;

import java.util.ArrayList;
import java.util.List;

public class Directory implements FileSystemItem {
    private String name;
    private List<FileSystemItem> children = new ArrayList<>();

    public Directory(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void add(FileSystemItem item) {
        children.add(item);
    }

    @Override
    public void remove(FileSystemItem item) {
        children.remove(item);
    }

    @Override
    public List<FileSystemItem> getChildren() {
        return children;
    }

    @Override
    public boolean isDirectory() {
        return true;
    }
}