package com.smartedit.backend.patterns.singleton;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.command.CommandManager;
import com.smartedit.backend.patterns.memento.MementoManager;

public class EditorManager {
    private static volatile EditorManager instance;
    private Document currentDocument;
    private CommandManager commandManager;
    private MementoManager mementoManager;

    private EditorManager() {
        this.currentDocument = new Document();
        this.commandManager = new CommandManager();
        this.mementoManager = new MementoManager();
        System.out.println("Instance generated.");
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

    public void setCurrentDocument(Document document) {
        this.currentDocument = document;
    }
}
