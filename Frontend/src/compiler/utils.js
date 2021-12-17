
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

function leftTrim(str) {
    return str.replace(/(^\s*)/g, "")
}

function rightTrim(str) {
    return str.replace(/(\s*$)/g, "")
}

export {trim, leftTrim, rightTrim}