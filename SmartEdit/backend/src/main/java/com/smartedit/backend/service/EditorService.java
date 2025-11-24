package com.smartedit.backend.service;

import org.springframework.stereotype.Service;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.command.CommandManager;

@Service
public class EditorService {
    private Document currentDocument;
    private CommandManager commandManager;

    public EditorService() {
        this.currentDocument = new Document();
        this.commandManager = new CommandManager();
    }

    public Document getCurrentDocument() {
        return currentDocument;
    }

    public CommandManager getCommandManager() {
        return commandManager;
    }
}
