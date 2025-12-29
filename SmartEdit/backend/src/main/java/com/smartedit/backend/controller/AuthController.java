package com.smartedit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedit.backend.patterns.singleton.AuthManager;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private AuthManager authManager = AuthManager.getInstance(); // singleton burada tek instance çekiyo knk burayı anlatırız

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean success = authManager.login(request.getUsername(), request.getPassword());
        
        if (success) {
            return ResponseEntity.ok("Login successful. Welcome " + authManager.getCurrentUser().getFullName());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        boolean success = authManager.register(request.getUsername(), request.getPassword(), request.getFullName());
        
        if (success) {
            return ResponseEntity.ok("User registered successfully");
        } else {
            return ResponseEntity.badRequest().body("Username already exists");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authManager.logout();
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        if (authManager.isLoggedIn()) {
            return ResponseEntity.ok(authManager.getCurrentUser());
        }
        return ResponseEntity.status(401).body("No active session");
    }
}