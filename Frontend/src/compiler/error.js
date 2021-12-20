class Error {
    msg = ''
    line_num = ''
    line_pos = ''

    toString() {
        return this.line_num + ':' + this.line_pos + ' ' + this.msg
    }
}