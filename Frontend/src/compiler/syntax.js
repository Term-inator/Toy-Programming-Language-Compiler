import { getAnalyzeTable } from '../api/syntax'
import { trim }  from './utils'

let analyze_table = ""

function setAnalyzeTable(analyze_table_str) {
    let rows = trim(analyze_table_str).split('\n')
    let headers = trim(rows[0]).split(' ')
    rows.pop(0)
    console.log(headers)
    analyze_table = analyze_table_str
}

export function syntaxAnalyzer() {
    getAnalyzeTable({

    }).then(data => {
        setAnalyzeTable(data.data)
    }).catch(() => {})
}