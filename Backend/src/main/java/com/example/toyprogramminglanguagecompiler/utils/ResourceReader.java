package com.example.toyprogramminglanguagecompiler.utils;

import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class ResourceReader {
    public String read(String filename, String charset) {
        String result = "";
        ClassPathResource classPathResource = new ClassPathResource("static/" + filename);
        try {
            InputStream inputStream = classPathResource.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, charset));
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
