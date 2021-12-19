
class SemNode {
    type = ''
    val = 0
    name = ''
    operator = ''
    bool = true
    kv = {}
}

let results = [{}]
let num_of_if = []

/**
 * 进行decl ->real|int规约时调用
 * @param {str} name 词法分析id值
 * @param {number} value 词法分析的digit值
 */
function declare(name, value) {
    results[results.length - 1] = value
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
function alOperate1(operate, nodelist) {
    let r = new SemNode()
    r.operator = operate
    value = 0
}

/**
 * arithexpr -> multexpr arithexprprime
 * multexpr -> simpleexpr multexprprime
 * @param {list} nodelist 
 */
function alOperate2(nodelist) {

}

/**
 * 分支语句处理
 * ifstmt -> if ( boolexpr ) then stmt else stmt规约时调用
 * @param {list} nodelist 
 * @returns SemNode
 */
function ifOperate(nodelist) {
    let r = new SemNode()
    let [node1, node2, node3] = nodelist
    if(node1.bool) {
        r = node2
    }
    else {
        r = node3
    }
    --num_of_if[num_of_if.length - 1]
    return r
}

/**
 * 处理if中的bool运算
 * @param {str} bool 
 * @param {list} nodelist 
 */
function boolOperate(bool, nodelist) {
    let node = new SemNode()
    let [node1, node2] = nodelist
    if(bool === '>') {
        node.bool = (node1.val > node2.val)
    }
    else if(bool === '<') {
        node.bool = (node1.val < node2.val)
    }
    else if(bool === '<=') {
        node.bool = (node1.val <= node2.val)
    }
    else if(bool === '>=') {
        node.bool = (node1.val >= node2.val)
    }
    else {
        node.bool = (node1.val === node2.val)
    }
}

/**
 * simpleexpr -> INTNUM
 * simpleexpr -> REALNUM
 * simpleexpr -> ID
 * @param {Token} token 
 * @returns 
 */
function getSimexpr(token) {
    let node = new SemNode()
    if(token.token_type === 'identifiers') {
        node.name = token.attr_val
        node.val = results[results.length - 1].get(node.name) // TODO ?
    }
    else {
        node.val = token.attr_val
    }
    return node
}

/**
 * stmts -> stmt stmts
 * @param {list} nodelist 
 * @returns SemNode
 */
function getStmts(nodelist) {
    let temp = {}
    nodelist.forEach((node) => {
        temp.update(node.kv) // TODO ?
    })
    let r = new SemNode()
    r.kv = temp
    return r
}

/**
 * compoundstmt -> { stmts }
 * @param {SemNode} node 
 * @returns SemNode
 */
function doCompoundstmt(node) {
    results.pop()
    num_of_if.pop()
    return node
}

/**
 * stmt -> ifstmt
 * stmt -> assgstmt
 * stmt -> compoundstmt
 * @param {SemNode} node 
 * @returns SemNode
 */
function doStmt(node) {
    if(num_of_if[num_of_if.length - 1] === 0) {
        results[results.length - 1].update(node.kv) // TODO ?
    }
    return node
}

/**
 * 用于返回最终结果
 * program -> decls compoundstmt
 * @param {SemNode} node 
 * @returns 
 */
function getResult(node) {
    let r = results.pop()
    r.update(node.kv) // TODO ?
    return r
}

export function semanticAnalyzer(ast) {
}