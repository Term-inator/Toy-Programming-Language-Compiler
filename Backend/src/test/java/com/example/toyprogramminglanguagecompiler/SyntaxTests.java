package com.example.toyprogramminglanguagecompiler;

import com.example.toyprogramminglanguagecompiler.service.impl.SyntaxServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SyntaxTests {

    @Test
    void analyzeTable() {
        SyntaxServiceImpl syntaxService = new SyntaxServiceImpl();
        String res = syntaxService.readAnalyzeTable();
        System.out.println(res);
    }
}
