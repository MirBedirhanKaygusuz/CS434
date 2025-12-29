package com.smartedit.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.patterns.composite.Directory;
import com.smartedit.backend.patterns.composite.FileSystemItem;
import com.smartedit.backend.patterns.singleton.EditorManager;

@RestController
@RequestMapping("/api/directory")
@CrossOrigin(origins = "http://localhost:3000")
public class DirectoryController {

    // bu da klasörü getir (get de yapılabilirmiş aslında da ağaç gibi çıkarsın diye ağaç olsun)
    @GetMapping("/tree")
    public ResponseEntity<List<ItemDTO>> getFileTree() {
        Directory root = EditorManager.getInstance().getRootDirectory();
        List<ItemDTO> tree = new ArrayList<>();
        
        convertData(root, tree);
        
        return ResponseEntity.ok(tree); 
    }

    // Yeni klasörü oluşturma
    @PostMapping("/create")
    public ResponseEntity<String> createFolder(@RequestBody Map<String, String> payload) {
        String folderName = payload.get("name");
        
        Directory newFolder = new Directory(folderName);
        EditorManager.getInstance().getRootDirectory().add(newFolder);
        
        return ResponseEntity.ok("Folder created: " + folderName);
    }

    private void convertData(FileSystemItem item, List<ItemDTO> list) {
        if (item instanceof Directory) {
            for (FileSystemItem child : item.getChildren()) {
                ItemDTO dto = new ItemDTO(child.getName(), child.isDirectory());
                if (child.isDirectory()) {
                    convertData(child, dto.children);
                }
                list.add(dto);
            }
        }
    }
    
    static class ItemDTO {
        public String name;
        public boolean isDirectory;
        public List<ItemDTO> children;

        public ItemDTO(String name, boolean isDirectory) {
            this.name = name;
            this.isDirectory = isDirectory;
            this.children = isDirectory ? new ArrayList<>() : null;
        }
    }
}