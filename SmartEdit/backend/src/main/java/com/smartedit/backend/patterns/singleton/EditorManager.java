package com.smartedit.backend.patterns.singleton;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.command.CommandManager;
import com.smartedit.backend.patterns.composite.Directory;
import com.smartedit.backend.patterns.composite.FileSystemItem;
import com.smartedit.backend.patterns.memento.MementoManager;

public class EditorManager {
    private static volatile EditorManager instance;
    private Document currentDocument;
    private CommandManager commandManager;
    private MementoManager mementoManager;

    private Directory rootDirectory;

    private final String STORAGE_DIR = "storage/";

    private EditorManager() {
        this.currentDocument = new Document();
        this.commandManager = new CommandManager();
        this.mementoManager = new MementoManager();

        this.rootDirectory = new Directory("My Notes");
        
        this.currentDocument.setFileName("Welcome.txt");
        this.currentDocument.setContent("Welcome to SmartEdit!");
        this.rootDirectory.add(this.currentDocument);

        loadExistingFiles();

        System.out.println("EditorManager initialized with Root Directory.");
    }

    private void loadExistingFiles() {
        File folder = new File(STORAGE_DIR);
        if (!folder.exists()) {
            folder.mkdirs(); 
            return;
        }

        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    String fullName = file.getName();
                    
                    String content = "";
                    try {
                        content = Files.readString(file.toPath());
                    } catch (IOException e) {
                        System.err.println("Error reading file: " + fullName);
                    }

                    Document doc = new Document();
                    doc.setFileName(fullName);
                    doc.setContent(content);
                    
                    rootDirectory.add(doc);
                }
            }
        }
    }

    public static EditorManager getInstance() {
        if (instance == null) {
            synchronized (EditorManager.class) {
                if (instance == null) {
                    instance = new EditorManager();
                }
            }
        }
        return instance;
    }

    public Document getCurrentDocument() { return currentDocument; }
    public CommandManager getCommandManager() { return commandManager; }
    public MementoManager getMementoManager() { return mementoManager; }
    public Directory getRootDirectory() { return rootDirectory; }

    public void setCurrentDocument(Document document) {
        this.currentDocument = document;
    }

    public Directory findDirectory(String name) {
        if (name == null || name.isEmpty() || name.equals("Root")) {
            return rootDirectory;
        }
        return searchDirectory(rootDirectory, name);
    }

    private Directory searchDirectory(Directory current, String name) {
        if (current.getName().equals(name)) return current;
        for (FileSystemItem item : current.getChildren()) {
            if (item.isDirectory()) {
                Directory found = searchDirectory((Directory) item, name);
                if (found != null) return found;
            }
        }
        return null;
    }

    public boolean deleteFile(String fileName) {
        FileSystemItem itemToRemove = findItem(rootDirectory, fileName);
        if (itemToRemove != null) {
            rootDirectory.remove(itemToRemove);
            
            File file = new File(STORAGE_DIR + fileName);
            if (file.exists()) {
                return file.delete();
            }
            return true;
        }
        return false;
    }

    private FileSystemItem findItem(Directory dir, String name) {
        for (FileSystemItem item : dir.getChildren()) {
            if (item.getName().equals(name)) {
                return item;
            }
        }
        return null;
    }
}
