package com.smartedit.backend.patterns.singleton;

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

    private EditorManager() {
        this.currentDocument = new Document();
        this.commandManager = new CommandManager();
        this.mementoManager = new MementoManager();

        this.rootDirectory = new Directory("My Notes");
        
        this.currentDocument.setFileName("Welcome.txt");
        this.currentDocument.setContent("Welcome to SmartEdit!");
        this.rootDirectory.add(this.currentDocument);

        System.out.println("EditorManager initialized with Root Directory.");
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
        
        if (current.getName().equals(name)) {
            return current;
        }

        for (FileSystemItem item : current.getChildren()) {
            if (item.isDirectory()) {
                Directory found = 
                    searchDirectory((Directory) item, name);
                if (found != null) return found;
            }
        }
        return null;
    }
}
