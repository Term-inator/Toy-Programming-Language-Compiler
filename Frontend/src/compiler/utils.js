
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

function leftTrim(str) {
    return str.replace(/(^\s*)/g, "")
}

function rightTrim(str) {
    return str.replace(/(\s*$)/g, "")
}

function update(map1, map2) {
    for(let k in map2) {
        map1[k] = map2[k]
    }
    return map1
}

function calculate(num1,num2,operator){
    let r = 0
    if (operator === '+')
        return r = num1 + num2
    else if(operator === '-')
        return r = num1 - num2
    else if(operator === '*')
        return r = num1 * num2
    else if (operator === '/')
        return r = num1 / num2
}

export {trim, leftTrim, rightTrim, update,calculate}