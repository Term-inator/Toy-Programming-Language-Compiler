package com.example.toyprogramminglanguagecompiler.service.impl;

import com.example.toyprogramminglanguagecompiler.service.SyntaxService;
import org.springframework.core.io.ClassPathResource;

import java.io.*;

public class SyntaxServiceImpl implements SyntaxService {
    @Override
    public String readAnalyzeTable() {
        String result = "";
        ClassPathResource classPathResource = new ClassPathResource("static/analyzeTable.txt");
        try {
            InputStream inputStream = classPathResource.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "unicode"));
            String line = null;
            while((line = reader.readLine()) != null) {
                result += (line + '\n');
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }
}
