package com.smartedit.backend.patterns.command;

public interface Command {
    void execute();
    void undo();
    String getDescription();
}
