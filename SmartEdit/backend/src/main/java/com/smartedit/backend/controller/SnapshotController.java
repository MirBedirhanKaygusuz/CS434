package com.smartedit.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.model.Document;
import com.smartedit.backend.patterns.memento.DocumentMemento;
import com.smartedit.backend.patterns.memento.SnapshotInfo;
import com.smartedit.backend.service.EditorService;

@RestController
@RequestMapping("/api/snapshot")
@CrossOrigin(origins = "http://localhost:3000")
public class SnapshotController {
    private final EditorService editorService;

    public SnapshotController(EditorService editorService) {
        this.editorService = editorService;
    }

    // Anlık snapshot oluşturma
    @PostMapping("/create")
    public ResponseEntity<String> createSnapshot() {
        Document doc = editorService.getCurrentDocument();
        DocumentMemento memento = doc.createMomento();
        String snapshotId = editorService.getMementoManager().saveSnapshot(memento);
        return ResponseEntity.ok(snapshotId);
    }

    @GetMapping("/list")
    public ResponseEntity<List<SnapshotInfo>> listSnapshots() {
        return ResponseEntity.ok(editorService.getMementoManager().getAllSnapshots());
    }

    @PostMapping("/restore/{id}")
    public ResponseEntity<EditorResponse> restoreSnapshot(@PathVariable String id) {
        DocumentMemento memento = editorService.getMementoManager().getSnapshot(id);

        if (memento != null) {
            editorService.getCurrentDocument().restore(memento);
            return ResponseEntity.ok(new EditorResponse(editorService.getCurrentDocument().getContent(), true));
        }

        return ResponseEntity.notFound().build();
    }
}
