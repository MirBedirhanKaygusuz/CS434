package com.smartedit.backend.service;

import org.springframework.stereotype.Service;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.command.CommandManager;
import com.smartedit.backend.patterns.memento.MementoManager;
import com.smartedit.backend.patterns.observer.AutoSaveObserver;
import com.smartedit.backend.patterns.observer.StatusBarObserver;
import com.smartedit.backend.patterns.singleton.EditorManager;

@Service
public class EditorService {
    private StatusBarObserver statusBarObserver;

    public EditorService() {
        EditorManager manager = EditorManager.getInstance();
        this.statusBarObserver = new StatusBarObserver();
        AutoSaveObserver autoSaveObserver = new AutoSaveObserver(manager.getMementoManager());

        manager.getCurrentDocument().attach(this.statusBarObserver);
        manager.getCurrentDocument().attach(autoSaveObserver);
    }

    public Document getCurrentDocument() {
        return EditorManager.getInstance().getCurrentDocument();
    }

    public CommandManager getCommandManager() {
        return EditorManager.getInstance().getCommandManager();
    }

    public MementoManager getMementoManager() {
        return EditorManager.getInstance().getMementoManager();
    }

    public StatusBarObserver getStatusBarObserver() {
        return statusBarObserver;
    }
}
