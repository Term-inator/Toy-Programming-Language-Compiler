package com.example.toyprogramminglanguagecompiler.controller;

import com.example.toyprogramminglanguagecompiler.model.BaseResponse;
import com.example.toyprogramminglanguagecompiler.service.impl.SyntaxServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;


@RestController
@RequestMapping("/syntax")
public class SyntaxController {
    @GetMapping("/analyzeTable")
    public BaseResponse<?> getAnalyzeTable() {
        SyntaxServiceImpl syntaxService = new SyntaxServiceImpl();
        String result = syntaxService.readAnalyzeTable();
        return BaseResponse.ok("ok", result);
    }
}
