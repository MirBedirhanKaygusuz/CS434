package com.smartedit.backend.patterns.command;

import com.smartedit.backend.model.Document;

public class DeleteTextCommand implements Command {
    private Document document;
    private int startPos;
    private int length;
    private String deletedText;

    public DeleteTextCommand(Document doc, int start, int length) {
        this.document = doc;
        this.startPos = start;
        this.length = length;
    }

    @Override
    public void execute() {
        deletedText = document.getText(startPos, length);
        document.delete(startPos, length);
    }

    @Override
    public void undo() {
        document.insert(startPos, deletedText);
    }

    @Override
    public String getDescription() {
        return "Delete: " + deletedText;
    }
}
