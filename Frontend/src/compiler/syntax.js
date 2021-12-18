import { getProductionRule, getAnalyzeTable } from '../api/syntax'
import { trim }  from './utils'

const EPS = ''
const END = '$'
const TERMINAL = 0
const N_TERMINAL = 1

class ProductionRule {
    /**
     * @param {int} id : sequence number
     * @param {str} left : str on the left side of ->
     * @param {list} right : str on the right side of ->
     * A -> abB
     * left: A
     * right: abB
     */
    constructor(id, left, right) {  // id, str, list of str
        this.id = id
        this.left = left
        this.right = right
    }
}

let production_rules = []

function setProductionRules(production_rule_str) {
    let rows = trim(production_rule_str).split('\n')
    let id = 0
    rows.forEach((row) => {
        let [left, rights] = trim(row).split('->')
        left = trim(left)
        rights = trim(rights).split('|')
        rights.forEach((right) => {
            right = trim(right).split(' ')
            let right_symbols = []
            right.forEach((r) => {
                if(r === 'EPS') {
                    right_symbols.push(EPS)
                }
                else {
                    right_symbols.push(r)
                }
            })
            let production_rule = new ProductionRule(id++, left, right_symbols)
            production_rules.push(production_rule)
        })
    })
}

let analyze_table = []

function setAnalyzeTable(analyze_table_str) {
    // console.log(analyze_table_str)
    let rows = trim(analyze_table_str).split('\n')
    let headers = trim(rows[0]).split(' ')
    rows.shift()
    
    rows.forEach((row) => {
        row = trim(row).split(' ')
        let elements = {}
        for(let i = 0; i < headers.length; ++i) {
            elements[headers[i]] = row[i]
        }
        analyze_table.push(elements)
    })
}

export function getLRProductionRule() {
    getProductionRule({

    }).then(data => {
        setProductionRules(data.data)
        // console.log(production_rules)
    }).catch(() => {})
}

export function getLRAnalyzeTable() {
    getAnalyzeTable({

    }).then(data => {
        setAnalyzeTable(data.data)
        // console.log(analyze_table)
    }).catch(() => {})
}

// AST
class Node {
    constructor(type, val, children) {
        this.type = type // 终结符 val = token : Token; 非终结符 val = production_rule : ProductionRule
        this.val = val
        this.children = children
    }

    getVal() {
        if(this.type === TERMINAL) {
            return this.val.attr_val
        }
        else if(this.type === N_TERMINAL) {
            return this.val.left
        }
        else {
            return null
        }
    }
}

// syntax analyze
function empty(state_stack, symbol_stack) {
    if(state_stack.length > 1 || state_stack[0] !== 0) {
        return false
    }
    if(symbol_stack.length > 1 || symbol_stack[0] !== END) {
        return false
    }
    return true
}

function top(stack) {
    if(stack.length === 0) {
        return null
    }
    return stack[stack.length - 1]
}

function tokenToTerminal(token) {
    if(token === END) {
        return token
    }
    switch(token.token_type) {
        case 'identifiers':
            return 'ID'
        case 'intnum':
            return 'INTNUM'
        case 'realnum':
            return 'REALNUM'
        default:
            return token.attr_val
    }
}

function parseCommand(command) {  // s1 r2 etc.
    if(command === 'acc') {
        return {
            op: 'acc'
        }
    }
    let op = command[0]
    if(op === 's') {
        return {
            op: op,
            dst: command.substring(1)
        }
    }
    else if(op === 'r') {
        return {
            op: op,
            production_rule_id: command.substring(1)
        }
    }
    else {
        return {
            op: 'e' // 对应表项为0
        }
    }
}

export function syntaxAnalyzer(input) {
    let node_stack = []

    let state_stack = [0]
    let symbol_stack = [END]
    input.push(END)
    // console.log(input)
    for(let i = 0; i < input.length; ++i) {
        let token = input[i]
        let state_top = top(state_stack)
        let command = analyze_table[state_top][tokenToTerminal(token)]
        command = parseCommand(command)
        // console.log(command)
        if(command.op === 's') {
            state_stack.push(Number(command.dst))
            symbol_stack.push(token)
            node_stack.push(new Node(TERMINAL, token, null))
        }
        else if(command.op === 'r') {
            let production_rule = production_rules[command.production_rule_id]
            let children = []
            // console.log(production_rule)
            for(let j = 0; j < production_rule.right.length; ++j) {
                if(production_rule.right[j] !== EPS) { // 空产生式不弹栈
                    state_stack.pop()
                    symbol_stack.pop()
                    children.unshift(node_stack.pop())
                }
                // console.log(state_stack)
                // symbol_stack.forEach(symbol => console.log(symbol))
            }
            state_stack.push(Number(analyze_table[top(state_stack)][production_rule.left]))
            symbol_stack.push(production_rule.left)
            node_stack.push(new Node(N_TERMINAL, production_rule, children))
            --i // 规约不压输入字符进栈
        }
        else if(command.op === 'e') {
            // TODO
            console.log('fail')
            return
        }
        else if(command.op === 'acc') {
            if(i === input.length - 1) {
                console.log('acc')
                return node_stack[0]
            }
            else {
                // TODO
                console.log('fail')
                return
            }
        }
        if(empty(state_stack, symbol_stack) && i === input.length - 1) {
            // TODO
            console.log('fail')
            return
        }
    }
}