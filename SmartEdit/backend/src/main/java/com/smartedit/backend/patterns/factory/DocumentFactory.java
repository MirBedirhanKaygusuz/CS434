package com.smartedit.backend.patterns.factory;

import com.smartedit.backend.model.Document;

public abstract class DocumentFactory {
    public abstract Document createDocument(String fileName);
}
