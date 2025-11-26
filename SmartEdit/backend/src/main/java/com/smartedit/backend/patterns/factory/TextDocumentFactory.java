package com.smartedit.backend.patterns.factory;

import com.smartedit.backend.model.Document;

public class TextDocumentFactory extends  DocumentFactory {
    @Override
    public Document createDocument(String fileName) {
        Document doc = new Document();
        doc.setFileName(fileName + ".txt");
        return doc;
    }
}
