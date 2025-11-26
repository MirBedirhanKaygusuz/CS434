package com.smartedit.backend.patterns.observer;

import com.smartedit.backend.model.Document;

public class StatusBarObserver implements DocumentObserver {
    private int wordCount = 0;
    private int charCount = 0;

    @Override
    public void update(Document document) {
        String content = document.getContent();
        this.charCount = content.length();

        if (content.trim().isEmpty()) {
            this.wordCount = 0;
        } else {
            this.wordCount = content.trim().split("\\s+").length;
        }

        System.out.println("Status bar updated: " + wordCount + " words, " + charCount + " chars.");
    }

    public int getWordCount() { return wordCount; }
    public int getCharCount() { return charCount; }
}
