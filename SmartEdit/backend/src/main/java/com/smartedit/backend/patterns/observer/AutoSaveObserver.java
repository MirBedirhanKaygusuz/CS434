package com.smartedit.backend.patterns.observer;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.memento.DocumentMemento;
import com.smartedit.backend.patterns.memento.MementoManager;

public class AutoSaveObserver implements DocumentObserver {
    private MementoManager mementoManager;

    public AutoSaveObserver(MementoManager mementoManager) {
        this.mementoManager = mementoManager;
    }

    @Override
    public void update(Document document) {
        DocumentMemento memento = document.createMomento();
        String snapshotId = mementoManager.saveSnapshot(memento);
        System.out.println("Autosave: Snapshot saved with ID: " + snapshotId);
    }
}

