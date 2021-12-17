package com.example.toyprogramminglanguagecompiler.controller;

import com.example.toyprogramminglanguagecompiler.service.impl.SyntaxServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/syntax")
public class SyntaxController {
    @GetMapping("/analyze_table")
    public String getAnalyzeTable() {
        SyntaxServiceImpl syntaxService = new SyntaxServiceImpl();
        String result = syntaxService.readAnalyzeTable();
        return result;
    }
}
