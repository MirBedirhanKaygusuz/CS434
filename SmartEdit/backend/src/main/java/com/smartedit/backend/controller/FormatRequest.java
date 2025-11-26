package com.smartedit.backend.controller;

public class FormatRequest {
    private String selection;
    private String format;
    private int start;
    private int end;          

    public String getSelection() { return selection; }
    public void setSelection(String selection) { this.selection = selection; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public int getStart() { return start; }
    public void setStart(int start) { this.start = start; }
    public int getEnd() { return end; }
    public void setEnd(int end) { this.end = end; }
}