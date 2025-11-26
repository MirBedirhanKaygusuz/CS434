package com.smartedit.backend.patterns.command;

import com.smartedit.backend.model.Document;

public class ReplaceTextCommand implements Command {
    private Document document;
    private int start;
    private int length;
    private String newText;
    private String oldText;

    public ReplaceTextCommand(Document doc, int start, int length, String newText) {
        this.document = doc;
        this.start = start;
        this.length = length;
        this.newText = newText;
    }

    @Override
    public void execute() {
        this.oldText = document.getText(start, length);
        document.delete(start, length);
        document.insert(start, newText);
    }

    @Override
    public void undo() {        
        document.delete(start, newText.length());
        document.insert(start, oldText);
    }

    @Override
    public String getDescription() {
        return "Replace text at " + start;
    }
}