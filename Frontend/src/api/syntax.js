import axios from "axios"

export function getProductionRule(data) {
    return axios({
        url: '/syntax/production_rule',
        method: 'get',
        params: data
    })
}

export function getAnalyzeTable(data) {
    return axios({
        url: '/syntax/analyze_table',
        method: 'get',
        params: data
    })
}