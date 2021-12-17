package com.example.toyprogramminglanguagecompiler.controller;

import com.example.toyprogramminglanguagecompiler.service.impl.SyntaxServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/syntax")
public class SyntaxController {
    SyntaxServiceImpl syntaxService = new SyntaxServiceImpl();

    @GetMapping("/production_rule")
    public String getProductionRule() {
        String result = syntaxService.readProductionRules();
        return result;
    }

    @GetMapping("/analyze_table")
    public String getAnalyzeTable() {
        String result = syntaxService.readAnalyzeTable();
        return result;
    }
}
