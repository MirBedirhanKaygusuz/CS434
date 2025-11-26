package com.smartedit.backend.patterns.decorator;

public class UnderlineDecorator extends TextDecorator {
    public UnderlineDecorator(TextComponent tempText) {
        super(tempText);
    }

    @Override
    public String getText() {
        return "<u>" + super.getText() + "</u>";
    }
}