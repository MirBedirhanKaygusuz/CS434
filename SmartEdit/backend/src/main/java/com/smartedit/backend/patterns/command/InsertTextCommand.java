package com.smartedit.backend.patterns.command;

import com.smartedit.backend.model.Document;

public class InsertTextCommand implements Command {
    private Document document;
    private String text;
    private int position;

    public InsertTextCommand(Document doc, String text, int position) {
        this.document = doc;
        this.text = text;
        this.position = position;
    }

    @Override
    public void execute() {
        document.insert(position, text);
    }

    @Override
    public void undo() {
        document.delete(position, text.length());
    }

    @Override
    public String getDescription() {
        return "Insert: " + text;
    }
}
