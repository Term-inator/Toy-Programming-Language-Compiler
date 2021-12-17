package com.example.toyprogramminglanguagecompiler.service.impl;

import com.example.toyprogramminglanguagecompiler.service.SyntaxService;
import com.example.toyprogramminglanguagecompiler.utils.ResourceReader;


public class SyntaxServiceImpl implements SyntaxService {
    @Override
    public String readProductionRules() {
        ResourceReader reader = new ResourceReader();
        return reader.read("production_rules.txt", "utf-8");
    }

    @Override
    public String readAnalyzeTable() {
        ResourceReader reader = new ResourceReader();
        return reader.read("analyze_table.txt", "unicode");
    }
}
