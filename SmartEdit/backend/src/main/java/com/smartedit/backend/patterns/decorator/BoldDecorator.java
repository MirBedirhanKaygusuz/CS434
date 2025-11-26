package com.smartedit.backend.patterns.decorator;

public class BoldDecorator extends TextDecorator {
    public BoldDecorator(TextComponent tempText) {
        super(tempText);
    }

    @Override
    public String getText() {
        return "<b>" + super.getText() + "</b>";
    }
}