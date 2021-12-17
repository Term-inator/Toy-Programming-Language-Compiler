package com.example.toyprogramminglanguagecompiler.controller;

import com.example.toyprogramminglanguagecompiler.entity.LexAttr;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/lex")
public class LexicalController {
    @PostMapping("/upload")
    public void uploadLex(@RequestBody List<LexAttr> lexAttrList) {

    }

    @GetMapping("/download")
    public void downloadLex(HttpResponse response) {

    }
}
