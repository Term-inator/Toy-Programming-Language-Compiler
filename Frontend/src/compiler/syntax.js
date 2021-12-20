import {getProductionRule, getAnalyzeTable} from '../api/syntax'
import {trim, update,calculate} from './utils'

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
                if (r === 'EPS') {
                    right_symbols.push(EPS)
                } else {
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
        for (let i = 0; i < headers.length; ++i) {
            elements[headers[i]] = row[i]
        }
        analyze_table.push(elements)
    })
}

export function getLRProductionRule() {
    getProductionRule({}).then(data => {
        setProductionRules(data.data)
        console.log(production_rules)
    }).catch(() => {
    })
}

export function getLRAnalyzeTable() {
    getAnalyzeTable({}).then(data => {
        setAnalyzeTable(data.data)
        // console.log(analyze_table)
    }).catch(() => {
    })
}

// AST
class Node {
    constructor(type, val, children) {
        this.type = type // 终结符 val = token : Token; 非终结符 val = production_rule : ProductionRule
        this.val = val
        this.children = children
        this.sem = {
            val: 0,
            operator: '',
            bool: '',
            kv: {}
        }
    }

    getVal() {
        if (this.type === TERMINAL) {
            return this.val.attr_val
        } else if (this.type === N_TERMINAL) {
            return this.val.left
        } else {
            return null
        }
    }
}

// semantic
let results = [{}]
let ultimate_result = {}
let num_of_if = []
let operator_list = []
let num_list = []

/**
 * 进行decl ->real|int规约时调用
 * @param {str} name 词法分析id值
 * @param {number} value 词法分析的digit值
 */
function declare(children) {
    // console.log(children)
    let name = children[1]
    let value = children[3]
    results[results.length - 1][name.val.attr_val] = value.val.attr_val
}

/**
 * 算术运算操作
 * arithexprprime -> + multexpr arithexprprime
 * arithexprprime -> - multexpr arithexprprime
 * multexprprime -> * simpleexpr multexprprime
 * multexprprime -> / simpleexpr multexprprime
 * 规约时调用
 * @param {str} operate
 * @param {list} nodelist
 */
function alOperate1(children) {
    if(children.length !== 0) {
        // console.log(children)
        operator_list.push(children[0].val.attr_val)
        num_list.push(children[1].sem.val)
        // console.log(children[1].sem.val)
    }
}

/**
 * arithexpr -> multexpr arithexprprime
 * multexpr -> simpleexpr multexprprime
 * @param {list} children
 */
function alOperate2(children) {
    let sim = children[0].sem.val
    // console.log(sim)
    console.log(num_list)
    console.log(operator_list)
    while(num_list.length !== 0){
        sim = calculate(sim,num_list.pop(),operator_list.pop())
    }
    let r = new Node()
    r.sem.val = sim
    // console.log(r.sem.val)
    return r
}

/**
 * assgstmt -> ID = arithexpr
 */
function assgOperate(children) {
    let r = new Node()
    r.sem.kv[children[0].val.attr_val] = children[2].sem.val
    console.log(r.sem.kv)
    return r
}

/**
 * 分支语句处理
 * ifstmt -> if ( boolexpr ) then stmt else stmt规约时调用
 * @param {list} children
 * @returns Node
 */
function ifOperate(children) {
    let r = null
    let node1 = children[2]
    let node2 = children[5]
    let node3 = children[7]
    if (node1.sem.bool) {
        r = node2
    } else {
        r = node3
    }
    --num_of_if[num_of_if.length - 1]
    console.log(r.sem.kv)
    return r
}

/**
 * 处理if中的bool运算
 * @param {str} bool
 * @param {list} nodelist
 */
function boolOperate(children) {
    let node = new Node()
    let node1 = children[0]
    let node2 = children[2]
    let bool = children[1].val.right[0]
    if (bool === '>') {
        node.sem.bool = (node1.val > node2.val)
    } else if (bool === '<') {
        node.sem.bool = (node1.val < node2.val)
    } else if (bool === '<=') {
        node.sem.bool = (node1.val <= node2.val)
    } else if (bool === '>=') {
        node.sem.bool = (node1.val >= node2.val)
    } else {
        node.sem.bool = (node1.val === node2.val)
    }
    return node
}


/**
 * simpleexpr -> INTNUM
 * simpleexpr -> REALNUM
 * simpleexpr -> ID
 * simpleexpr -> ( simplexpr )
 */
function getSimexpr(children) {
    let sem = {
        val: 0,
        operator: '',
        bool: '',
        kv: {}
    }
    if (children.length === 1) {
        let node = children[0]
        let token = node.val
        if (node.type === TERMINAL) {
            sem.val = results[results.length - 1][token.attr_val]
        } else {
            sem.val = token.attr_val
        }
    } else {
        sem.val = children[1].sem.val
    }
    // console.log(sem.val)
    return sem
}

/**
 * stmts -> stmt stmts
 * @param {list} children
 * @returns Node
 */
function getStmts(children) {
    let temp = {}
    for (let i in children){
        console.log(i)
        // console.log(children[0].val.right[0])
        if (children[i].val.right[0] !== 'EPS'){
            update(temp,children[i].sem.kv)
        }

    }
    let r = new Node()
    r.sem.kv = temp
    console.log(r.sem.kv)
    return r
}

/**
 * compoundstmt -> { stmts }
 * @param {Node} node
 * @returns Node
 */
function doCompoundstmt(children) {
    let node = children[1]
    results.pop()
    num_of_if.pop()
    console.log(children[1].sem.kv)
    return node
}

/**
 * stmt -> ifstmt
 * stmt -> assgstmt
 * stmt -> compoundstmt
 * @param {Node} node
 * @returns Node
 */
function doStmt(children) {
    let node = children[0]
    if (num_of_if[num_of_if.length - 1] === 0) {
        results[results.length - 1]=update(results[results.length - 1],node.sem.kv) // TODO ?
    }
    console.log(node.sem.kv)
    return node
}

/**
 * 用于返回最终结果
 * program -> decls compoundstmt
 * @param {Node} node
 * @returns
 */
function getResult(children) {
    let r = results.pop()
    console.log(r)
    let t = children[1]
    console.log(t.sem.kv)
    r = update(r, t.sem.kv)
    return r
}

// syntax analyze
function empty(state_stack, symbol_stack) {
    if (state_stack.length > 1 || state_stack[0] !== 0) {
        return false
    }
    if (symbol_stack.length > 1 || symbol_stack[0] !== END) {
        return false
    }
    return true
}

function top(stack) {
    if (stack.length === 0) {
        return null
    }
    return stack[stack.length - 1]
}

function tokenToTerminal(token) {
    if (token === END) {
        return token
    }
    switch (token.token_type) {
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
    if (command === 'acc') {
        return {
            op: 'acc'
        }
    }
    let op = command[0]
    if (op === 's') {
        return {
            op: op,
            dst: command.substring(1)
        }
    } else if (op === 'r') {
        return {
            op: op,
            production_rule_id: command.substring(1)
        }
    } else {
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
    for (let i = 0; i < input.length; ++i) {
        let token = input[i]
        let state_top = top(state_stack)
        let command = analyze_table[state_top][tokenToTerminal(token)]
        command = parseCommand(command)
        // console.log(command)
        if (command.op === 's') {
            state_stack.push(Number(command.dst))
            symbol_stack.push(token)
            node_stack.push(new Node(TERMINAL, token, null))
        } else if (command.op === 'r') {
            let production_rule = production_rules[command.production_rule_id]
            let children = []
            // console.log(production_rule)
            for (let j = 0; j < production_rule.right.length; ++j) {
                if (production_rule.right[j] !== EPS) { // 空产生式不弹栈
                    state_stack.pop()
                    symbol_stack.pop()
                    children.unshift(node_stack.pop())
                }
            }
            // console.log(production_rule.left, children)
            let sem = null
            switch (production_rule.left) {
                case 'program':
                    ultimate_result = getResult(children)
                    console.log(ultimate_result)
                    break
                case 'decls':
                    break
                case 'decl':
                    declare(children)
                    console.log(results[0])
                    break
                case 'stmt':
                    sem = doStmt(children).sem
                    console.log('dostmt')
                    break
                case 'compoundstmt':
                    sem = doCompoundstmt(children).sem
                    console.log('getcompoundstmt')
                    break
                case 'stmts':
                    sem = getStmts(children).sem
                    console.log('getstmts')
                    break
                case 'ifstmt':
                    sem = ifOperate(children).sem
                    console.log('ifo')
                    break
                case 'assgstmt':
                    sem = assgOperate(children).sem
                    console.log('assgstmt')
                    break
                case 'boolexpr':
                    sem = boolOperate(children).sem
                    console.log('bool')
                    break
                case 'boolop':
                    break
                    return null
                case 'arithexpr':
                    console.log('al2_arith_0')
                    sem =  alOperate2(children).sem
                    // console.log(sem)
                    console.log('al2_arith')
                    break
                case 'arithexprprime':
                    alOperate1(children)
                    console.log('al1_arith')
                    break
                case 'multexpr':
                    console.log('alt2mult_0')
                    sem = alOperate2(children).sem
                    console.log('al2mult')
                    break
                case 'multexprprime':
                    alOperate1(children)
                    console.log('al1mult')
                    break
                case 'simpleexpr':
                    sem = getSimexpr(children)
                    console.log('getsim')
                    // console.log(sem)
                    break
            }
            state_stack.push(Number(analyze_table[top(state_stack)][production_rule.left]))
            symbol_stack.push(production_rule.left)
            let node = new Node(N_TERMINAL, production_rule, children)
            node.sem = sem
            console.log(node.sem)
            node_stack.push(node)
            --i // 规约不压输入字符进栈
        } else if (command.op === 'e') {
            // TODO
            console.log('fail')
            return
        } else if (command.op === 'acc') {
            if (i === input.length - 1) {
                console.log('acc')
                return node_stack[0]
            } else {
                // TODO
                console.log('fail')
                return
            }
        }
        if (empty(state_stack, symbol_stack) && i === input.length - 1) {
            // TODO
            console.log('fail')
            return
        }
    }
}