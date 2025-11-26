package com.smartedit.backend.patterns.observer;

import com.smartedit.backend.model.Document;

public interface DocumentObserver{
    void update(Document document);
}
