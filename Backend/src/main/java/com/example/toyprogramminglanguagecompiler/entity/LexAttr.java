package com.example.toyprogramminglanguagecompiler.entity;

import lombok.Data;

@Data
public class LexAttr {
    private String token_type;
    private String attr_val;
    private int line_num;
    private int line_pos;
}
