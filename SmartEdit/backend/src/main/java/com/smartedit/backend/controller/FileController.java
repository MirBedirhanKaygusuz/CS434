package com.smartedit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.factory.DocumentFactory;
import com.smartedit.backend.patterns.factory.HTMLDocumentFactory;
import com.smartedit.backend.patterns.factory.MarkdownDocumentFactory;
import com.smartedit.backend.patterns.factory.TextDocumentFactory;
import com.smartedit.backend.patterns.singleton.EditorManager;
import com.smartedit.backend.patterns.strategy.FileManager;
import com.smartedit.backend.patterns.strategy.FileSaveStrategy;
import com.smartedit.backend.patterns.strategy.HTMLSaveStrategy;
import com.smartedit.backend.patterns.strategy.MarkdownSaveStrategy;
import com.smartedit.backend.patterns.strategy.TextSaveStrategy;

@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private final FileManager fileManager;

    public FileController(FileManager fileManager) {
        this.fileManager = fileManager;
    }

    @PostMapping("/new")
    public ResponseEntity<String> newFile(@RequestBody NewFileRequest request) {
        DocumentFactory factory;
        
        switch (request.getType().toLowerCase()) {
            case "md":
                factory = new MarkdownDocumentFactory();
                break;
            case "html":
                factory = new HTMLDocumentFactory();
                break;
            default:
                factory = new TextDocumentFactory();
                break;
        }
        
        Document newDoc = factory.createDocument(request.getFileName());
        
        EditorManager.getInstance().setCurrentDocument(newDoc);
        
        return ResponseEntity.ok("Created new " + request.getType() + " file: " + newDoc.getFileName());
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveFile(@RequestBody SaveRequest request) {
        FileSaveStrategy strategy;
        
        switch (request.getFormat().toLowerCase()) {
            case "txt":
                strategy = new TextSaveStrategy();
                break;
            case "md":
                strategy = new MarkdownSaveStrategy();
                break;
            case "html":
                strategy = new HTMLSaveStrategy();
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid format");
        }

        fileManager.setStrategy(strategy);
        fileManager.saveFile(request.getFileName(), request.getContent());

        return ResponseEntity.ok("File saved successfully as ." + strategy.getFileExtension());
    }
}
