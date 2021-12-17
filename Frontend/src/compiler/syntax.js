import { getProductionRule, getAnalyzeTable } from '../api/syntax'
import { trim }  from './utils'

const EPS = ''

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

export function syntaxAnalyzer() {
    
}