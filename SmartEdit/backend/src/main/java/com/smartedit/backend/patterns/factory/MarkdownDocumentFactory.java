package com.smartedit.backend.patterns.factory;

import com.smartedit.backend.model.Document;

public class MarkdownDocumentFactory extends DocumentFactory {
    @Override
    public Document createDocument(String fileName) {
        Document doc = new Document();
        doc.setFileName(fileName + ".md");
        doc.setContent("# " + fileName + "\n\nCreated with SmartEdit");
        return doc;
    }
}
