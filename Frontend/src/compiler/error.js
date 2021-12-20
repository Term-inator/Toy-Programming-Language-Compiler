export class Error {
    constructor(msg, line_num, line_pos) {
        this.msg = msg
        this.line_num = line_num
        this.line_pos = line_pos
    }

    toString() {
        return this.line_num + ':' + this.line_pos + ' ' + this.msg
    }
}