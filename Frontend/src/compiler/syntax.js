import { getAnalyzeTable } from '../api/syntax'
import { trim }  from './utils'

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

export function getLRAnalyzeTable() {
    getAnalyzeTable({

    }).then(data => {
        setAnalyzeTable(data.data)
    }).catch(() => {})
}