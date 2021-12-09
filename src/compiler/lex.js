let state_set = []
function initStateSet() {
  state_set.push({ id: 1, token_type: "numbers" })
  state_set.push({ id: 2, token_type: "numbers" })
  state_set.push({ id: 3, token_type: "numbers" })
  state_set.push({ id: 4, token_type: "numbers" })
  state_set.push({ id: 5, token_type: "numbers" })
  state_set.push({ id: 6, token_type: "numbers" })
  state_set.push({ id: 7, token_type: "numbers" })
  state_set.push({ id: 8, token_type: "numbers" })
  state_set.push({ id: 9, token_type: "numbers" })
  state_set.push({ id: 10, token_type: "numbers" })
  state_set.push({ id: 11, token_type: "numbers" })
  state_set.push({ id: 12, token_type: "numbers" })
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
// TODO 加一个识别形如12a的状态

function isIgnore(c) {
  if (c === '\n' || c === '\t' || c == ' ') {
    return true
  }
  else {
    return false
  }
}

function isLetter(c) {
  if ((c >= 'a' && c <= 'z') || (c >= 'Z' && c <= 'Z')) {
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
  token_type = ""
  attr_val = ""
  line_num = -1
  line_pos = -1

  constructor(token_type, attr_val, line_num, line_pos) {
    this.token_type = token_type
    this.attr_val = attr_val
    this.line_num = line_num
    this.line_pos = line_pos
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
  // 接收
  return 0;
}

export function lexicalAnalyzer(input) {
  initStateSet()
  let tokens = []
  let buffer = ""
  let line_num = 0
  let line_pos = 0
  let next_state_id = 0
  for (let i = 0; i < input.length; ++i) {
    let c = input[i]
    if (c === '\n') {
      ++line_num
      line_pos = 0
    }

    let current_state_id = next_state_id
    next_state_id = state_transfer(next_state_id, c)
    console.log(next_state_id, buffer, i=== input.length - 1)
    if (next_state_id === 0 || i === input.length - 1) {
      state_set.forEach(state => {
        if (state.id === current_state_id) {
          tokens.push(new LexAttr(state.token_type, buffer, line_num, line_pos))
          console.log("end")
          buffer = ""
          return
        }
      })
    }
    buffer += c
    ++line_pos
  }
  return tokens
}