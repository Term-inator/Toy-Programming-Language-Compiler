package com.example.toyprogramminglanguagecompiler.controller;

import com.example.toyprogramminglanguagecompiler.entity.LexAttr;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
public class LexicalController {
    @PostMapping("/upload/lex")
    public void uploadLex(@RequestBody List<LexAttr> lexAttrList) {

    }

    @GetMapping("/download/lex")
    public void downloadLex(HttpResponse response) {

    }
}
