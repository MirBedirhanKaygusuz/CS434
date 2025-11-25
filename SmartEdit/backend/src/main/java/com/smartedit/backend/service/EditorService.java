package com.smartedit.backend.service;

import org.springframework.stereotype.Service;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.command.CommandManager;
import com.smartedit.backend.patterns.memento.MementoManager;

@Service
public class EditorService {
    private Document currentDocument;
    private CommandManager commandManager;
    private MementoManager mementoManager;

    public EditorService() {
        this.currentDocument = new Document();
        this.commandManager = new CommandManager();
        this.mementoManager = new MementoManager();
    }

    public Document getCurrentDocument() {
        return currentDocument;
    }

    public CommandManager getCommandManager() {
        return commandManager;
    }

    public MementoManager getMementoManager() {
        return mementoManager;
    }
}
