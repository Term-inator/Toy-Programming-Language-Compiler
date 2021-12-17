<template>
    <div class='mainpage'>
        <div class='main'>
            <Row type='flex' justify='space-around' style='padding: 4vh 0 0 0'>
                <Col span='14'>
                    <Row>
                        <Input id='work-space' v-model='code' type='textarea' :rows='17' placeholder='Enter your code...' />
                    </Row>
                    <br>
                    <Row>
                        <Button type='success' size='large' @click='commitCode'>提交</Button>
                    </Row>
                </Col>
                <Col span='8'>
                    <Input id='log-space' v-model='lex_string' type='textarea' :rows='17' readonly />
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import {lexicalAnalyzer} from '@/compiler/lex'
import {getLRAnalyzeTable, syntaxAnalyzer} from '@/compiler/syntax'

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            code: "",
            lex_attrs: [],
            lex_string: "",
        }
    },
    mounted() {
        //textarea支持tab缩进
        $('textarea').on('keydown', function(e) {
            let tab_keycode = 9
            if (e.keyCode === tab_keycode) {
                e.preventDefault()
                var indent = '\t'
                var start = this.selectionStart
                var end = this.selectionEnd
                var selected = window.getSelection().toString()
                selected = indent + selected.replace(/\n/g, '\n' + indent)
                this.value = this.value.substring(0, start) + selected + this.value.substring(end)
                this.setSelectionRange(start + indent.length, start + selected.length)
            }
        })
        getLRAnalyzeTable()
    },
    methods: {
        commitCode() {
            if(this.code === '') {
                // TODO 空处理
                return
            }
            this.lex_attrs = lexicalAnalyzer(this.code)
            this.showLexAttrs()
            syntaxAnalyzer()
        },
        showLexAttrs() {
            let res = ""
            this.lex_attrs.forEach(lex_attr => {
                res += lex_attr.toString() + '\n'
            })
            this.lex_string = res
            console.log(this.lex_string)
        }
    }
}
</script>

<style scoped>
@import "../../assets/css/base.css";

.mainpage {
    min-height: 88vh;
    padding: 8vh 0 10vh 0;
}

#work-space /deep/ .ivu-input, #log-space /deep/ .ivu-input {
    font-size: 3vh;
    resize: none;
}
</style>