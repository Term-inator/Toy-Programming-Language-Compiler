import {Error} from './error'

let state_set = []
function initStateSet() {
    if (state_set.length === 0) {
        state_set.push({ id: 1, token_type: "numbers" })
        state_set.push({ id: 2, token_type: "error" })
        state_set.push({ id: 3, token_type: "error" })
        state_set.push({ id: 4, token_type: "numbers" })
        state_set.push({ id: 5, token_type: "error" })
        state_set.push({ id: 6, token_type: "numbers" })
        state_set.push({ id: 7, token_type: "error" })
        state_set.push({ id: 8, token_type: "numbers" })
        state_set.push({ id: 9, token_type: "error" })
        state_set.push({ id: 10, token_type: "error" })
        state_set.push({ id: 11, token_type: "numbers" })
        state_set.push({ id: 12, token_type: "error" })
        state_set.push({ id: 13, token_type: "numbers" })
        state_set.push({ id: 14, token_type: "identifiers" })
        state_set.push({ id: 15, token_type: "identifiers" })
        state_set.push({ id: 16, token_type: "operators" })
        state_set.push({ id: 17, token_type: "delimiters" })
        state_set.push({ id: 18, token_type: "operators" })
        state_set.push({ id: 19, token_type: "comments" })
        state_set.push({ id: 20, token_type: "operators" })
        state_set.push({ id: 21, token_type: "operators" })
        state_set.push({ id: 22, token_type: "ignore" })
        state_set.push({ id: 23, token_type: "comments" })
    }
}

let keywords = ["int", "real", "if", "then", "else"]

function isIgnore(c) {
    if (c === '\n' || c === '\t' || c === ' ') {
        return true
    }
    else {
        return false
    }
}

function isLetter(c) {
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
        return true
    }
    else {
        return false
    }
}

function isDigit(c) {
    if (c >= '0' && c <= '9') {
        return true
    }
    else {
        return false
    }
}

function isBound(c) {
    if (c === '(' || c === ')' || c === '{' || c === '}' || c === ';' || c === ',') {
        return true
    }
    else {
        return false
    }
}

function isOp1(c) {
    if (c === '+' || c === '-' || c === '*') {
        return true
    }
    else {
        return false
    }
}

function isOp2(c) {
    if (c === '<' || c === '>' || c === '=') {
        return true
    }
    else {
        return false
    }
}

function isDivi(c) {
    if (c === '/') {
        return true
    }
    else {
        return false
    }
}

class LexAttr {
    token_type = ''
    attr_val = ''
    line_num = -1
    line_pos = -1

    constructor(token_type, attr_val, line_num, line_pos) {
        this.token_type = token_type
        this.attr_val = attr_val
        this.line_num = line_num
        this.line_pos = line_pos
    }

    toString() {
        return "(" + this.token_type + ', ' + this.attr_val + ', ' + this.line_num + ', ' + this.line_pos + ')'
    }
}

function state_transfer(state_id, c) {
    switch (state_id) {
        case 0:
            if (isDigit(c)) return 1;
            if (isLetter(c)) return 14;
            if (isOp1(c)) return 16;
            if (isBound(c)) return 17;
            if (isDivi(c)) return 18;
            if (isOp2(c)) return 20;
            if (isIgnore(c)) return 22;
            break;
        case 1:
            if (isDigit(c)) return 1;
            if (c === 'E' || c === 'e') return 2;
            if (c === '.') return 7;
            break;
        case 2:
            if (c === '+') return 3;
            if (c === '-') return 5;
            if (isDigit(c)) return 4;
            break;
        case 3:
            if (isDigit(c)) return 4;
            break;
        case 4:
            if (isDigit(c)) return 4;
            break;
        case 5:
            if (isDigit(c)) return 6;
            break;
        case 6:
            if (isDigit(c)) return 6;
            break;
        case 7:
            if (isDigit(c)) return 8;
            break;
        case 8:
            if (isDigit(c)) return 8;
            if (c === 'E' || c === 'e') return 9;
            break;
        case 9:
            if (c === '+') return 10;
            if (c === '-') return 12;
            if (isDigit(c)) return 11;
            break;
        case 10:
            if (isDigit(c)) return 11;
            break;
        case 11:
            if (isDigit(c)) return 11;
            break;
        case 12:
            if (isDigit(c)) return 13;
            break;
        case 13:
            if (isDigit(c)) return 13;
            break;
        case 14:
            if (isDigit(c)) return 15;
            if (isLetter(c)) return 14;
            break;
        case 15:
            if (isDigit(c)) return 15;
            if (isLetter(c)) return 14;
            break;
        case 16:
            break;
        case 17:
            break;
        case 18:
            if (c === '/') return 19;
            break;
        case 19:
            if (c !== '\n' && c !== '\t') return 23;
            break;
        case 20:
            if (c === '=') return 21;
            break;
        case 21:
            break;
        case 22:
            break;
        case 23:
            if (c !== '\n' && c !== '\t') return 23;
            break
        default:
            return -1;
    }
    // ??????
    return 0;
}

export function lexicalAnalyzer(input) {
    let errors = [] // ?????????
    // ????????????
    input = ' ' + input + ' '
    initStateSet()
    let tokens = []
    let pre_index = 0
    let now_index = 0
    let line_num = 0
    let line_pos = 0
    let current_state_id = 0
    let next_state_id = 0

    for (let i = 0; i < input.length - 1; ++i) {
        now_index = i
        let c = input[now_index]
        let next_c = input[now_index + 1]
        //????????????,?????????????????????
        if (isLetter(c) === false && isBound(c) === false && isDigit(c) === false && 
            isDivi(c) === false && isOp1(c) === false && isOp2(c) === false 
            && isIgnore(c) === false && c !== '.') {
            let wrongtoken = new LexAttr("error", c, line_num, line_pos)
            errors.push(new Error("unexpected token " + c, line_num, line_pos - 1))
            tokens.push(wrongtoken)
            ++line_pos
            pre_index = now_index
            continue
        }
        if (c === '\n') {
            ++line_num
            line_pos = 0
        }

        current_state_id = state_transfer(current_state_id, c)
        next_state_id = state_transfer(current_state_id, next_c)
        console.log(c, current_state_id, next_state_id)

        if (next_state_id === 0 || i === input.length - 2) {
            state_set.forEach(state => {
                if (state.id === current_state_id) {
                    let token_val = input.substring(pre_index + 1, now_index + 1)
                    if (state.token_type === "error") {
                            errors.push(new Error("unexpected token" + token_val, line_num, line_pos - token_val.length))
                    }
                    else if (state.token_type !== "ignore") {
                        let token = new LexAttr(state.token_type, token_val, line_num, line_pos - token_val.length)
                        keywords.forEach(keyword => {
                            if (keyword === token.attr_val) {
                                token.token_type = "keywords"
                            }
                        })
                        // ???????????? + ????????????
                        if (token.token_type === "numbers") {
                            let num_type = 1 // 1????????? 2????????? 3???????????? 4????????????
                            
                            if(/^\d+(\.\d+)?e\+?\d+$/i.test(token.attr_val)) {
                                num_type = 4
                            }
                            else if(/^\d+(\.\d+)?e-?\d+$/i.test(token.attr_val)) {
                                num_type = 3
                            }
                            else if(/^\d+\.\d+$/.test(token.attr_val)) {
                                num_type = 2
                            }
                            
                            if (num_type === 1) {
                                token.token_type = 'intnum'
                                token.attr_val = Number(token.attr_val)
                                if (token.attr_val >= Math.pow(2, 31)) {
                                    errors.push(new Error("int " + token.attr_val + " out of range", line_num, line_pos - token_val.length))
                                    token.token_type = "error"
                                }
                            }
                            else {
                                token.token_type = 'realnum'
                                if (num_type === 2) {
                                    token.attr_val = Number(token.attr_val)
                                    if (token.attr_val >= Math.pow(10, 129)) {
                                        errors.push(new Error("real " + token.attr_val + " out of range", line_num, line_pos - token_val.length))
                                        token.token_type = "error"
                                    }

                                }
                                else if (num_type === 3) { // 3????????????
                                    let e_index = token.attr_val.search(/e-/i)
                                    let base_num = Number(token.attr_val.substring(0, e_index))
                                    let exp_num = Number(token.attr_val.substring(e_index + 2))
                                    token.attr_val = base_num * Math.pow(10, -exp_num)
                                    if (exp_num > 128) {
                                        errors.push(new Error("real " + token.attr_val + " out of range", line_num, line_pos - token_val.length))
                                        token.token_type = "error"
                                    }
                                }
                                else if (num_type === 4) { // 4????????????
                                    let e_index = token.attr_val.search(/e/i)
                                    let base_num = Number(token.attr_val.substring(0, e_index))
                                    let exp_num = 0
                                    if(/\+/.test(token.attr_val)) {
                                        exp_num = Number(token.attr_val.substring(e_index + 2))
                                    }
                                    else {
                                        exp_num = Number(token.attr_val.substring(e_index + 1))
                                    }
                                    token.attr_val = base_num * Math.pow(10, exp_num)
                                    if (exp_num > 128) {
                                        errors.push(new Error("real " + token.attr_val + " out of range", line_num, line_pos - token_val.length))
                                        token.token_type = "error"
                                    }
                                }
                            }
                        }
                        tokens.push(token)
                    }
                    current_state_id = 0
                    pre_index = now_index
                }
            })
        }
        ++line_pos
    }
    return {
        tokens: tokens, 
        errors: errors
    }
}