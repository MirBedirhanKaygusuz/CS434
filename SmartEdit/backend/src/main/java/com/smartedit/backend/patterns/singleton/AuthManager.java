package com.smartedit.backend.patterns.singleton;

import java.util.HashMap;
import java.util.Map;

import com.smartedit.backend.model.User;

public class AuthManager {
    
    private static volatile AuthManager instance;

    private Map<String, User> users;
    
    private User currentUser;

    private AuthManager() {
        //burası test için bu arada sonra silcem inş
        users = new HashMap<>();
        users.put("admin", new User("admin", "1234", "Admin User"));
        System.out.println("AuthManager (Singleton) initialized.");
    }

    public static AuthManager getInstance() {
        if (instance == null) {
            synchronized (AuthManager.class) {
                if (instance == null) {
                    instance = new AuthManager();
                }
            }
        }
        return instance;
    }


    public boolean register(String username, String password, String fullName) {
        if (users.containsKey(username)) {
            return false;
        }
        users.put(username, new User(username, password, fullName));
        return true;
    }

    public boolean login(String username, String password) {
        User user = users.get(username);
        if (user != null && user.getPassword().equals(password)) {
            this.currentUser = user;
            System.out.println("User logged in: " + username);
            return true;
        }
        return false;
    }

    public void logout() {
        if (currentUser != null) {
            System.out.println("User logged out: " + currentUser.getUsername());
        }
        this.currentUser = null;
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public boolean isLoggedIn() {
        return currentUser != null;
    }
}