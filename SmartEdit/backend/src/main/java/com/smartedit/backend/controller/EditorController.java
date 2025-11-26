package com.smartedit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.patterns.command.Command;
import com.smartedit.backend.patterns.command.InsertTextCommand;
import com.smartedit.backend.patterns.command.ReplaceTextCommand;
import com.smartedit.backend.patterns.decorator.BoldDecorator;
import com.smartedit.backend.patterns.decorator.ItalicDecorator;
import com.smartedit.backend.patterns.decorator.PlainText;
import com.smartedit.backend.patterns.decorator.TextComponent;
import com.smartedit.backend.patterns.decorator.UnderlineDecorator;
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

    @PostMapping("/format")
    public ResponseEntity<EditorResponse> formatText(@RequestBody FormatRequest request) {
        TextComponent component = 
            new PlainText(request.getSelection());

        switch (request.getFormat().toLowerCase()) {
            case "bold":
                component = new BoldDecorator(component);
                break;
            case "italic":
                component = new ItalicDecorator(component);
                break;
            case "underline":
                component = new UnderlineDecorator(component);
                break;
        }

        String formattedText = component.getText();

        int length = request.getEnd() - request.getStart();
        Command replaceCmd = new ReplaceTextCommand(
            editorService.getCurrentDocument(),
            request.getStart(),
            length,
            formattedText
        );
        editorService.getCommandManager().executeCommand(replaceCmd);

        return ResponseEntity.ok(createResponse());
    }
}
