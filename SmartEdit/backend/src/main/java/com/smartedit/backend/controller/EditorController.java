package com.smartedit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.patterns.command.Command;
import com.smartedit.backend.patterns.command.InsertTextCommand;
import com.smartedit.backend.service.EditorService;

@RestController
@RequestMapping("/api/editor")
@CrossOrigin(origins = "http://localhost:3000")
public class EditorController {
    private final EditorService editorService;

    private EditorResponse createResponse() {
        return new EditorResponse(
            editorService.getCurrentDocument().getContent(),
            true,
            editorService.getStatusBarObserver().getWordCount(),
            editorService.getStatusBarObserver().getCharCount()
        );
    }

    public EditorController(EditorService editorService) {
        this.editorService = editorService;
    }

    @PostMapping("/insert")
    public ResponseEntity<EditorResponse> insertText(@RequestBody InsertRequest request) {
        Command command = new InsertTextCommand(
            editorService.getCurrentDocument(), request.getText(), request.getPosition()
        );

        editorService.getCommandManager().executeCommand(command);

        return ResponseEntity.ok(createResponse());
    }

    @PostMapping("/undo")
    public ResponseEntity<EditorResponse> undo() {
        editorService.getCommandManager().undo();

        return ResponseEntity.ok(createResponse());
    }

    @PostMapping("/redo")
    public ResponseEntity<EditorResponse> redo() {
        editorService.getCommandManager().redo();

        return ResponseEntity.ok(createResponse());
    }
}
