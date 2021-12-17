import axios from "axios"

export function getAnalyzeTable(data) {
    return axios({
        url: '/syntax/analyze_table',
        method: 'get',
        params: data
    })
}