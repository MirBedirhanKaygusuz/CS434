package com.smartedit.backend.patterns.decorator;

public abstract class TextDecorator implements TextComponent {
    protected TextComponent tempText;

    public TextDecorator(TextComponent tempText) {
        this.tempText = tempText;
    }

    @Override
    public String getText() {
        return tempText.getText();
    }
}