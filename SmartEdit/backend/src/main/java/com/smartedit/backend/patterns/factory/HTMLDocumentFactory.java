package com.smartedit.backend.patterns.factory;

import com.smartedit.backend.model.Document;

public class HTMLDocumentFactory extends DocumentFactory {
    @Override
    public Document createDocument(String fileName) {
        Document doc = new Document();
        doc.setFileName(fileName + ".html");
        doc.setContent("<h1>" + fileName + "<h1>\n<p>Write...</p>");
        return doc;
    }
}
