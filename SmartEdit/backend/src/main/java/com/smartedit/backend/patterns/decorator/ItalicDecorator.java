package com.smartedit.backend.patterns.decorator;

public class ItalicDecorator extends TextDecorator {
    public ItalicDecorator(TextComponent tempText) {
        super(tempText);
    }

    @Override
    public String getText() {
        return "<i>" + super.getText() + "</i>";
    }
}