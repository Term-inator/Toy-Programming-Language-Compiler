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
                    <Input id='log-space' v-model='log_string' type='textarea' :rows='17' readonly />
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import {lexicalAnalyzer} from '@/compiler/lex'
import {getLRProductionRule, getLRAnalyzeTable, syntaxAnalyzer} from '@/compiler/syntax'

export default {
    name: 'mainPage',
    props: {
        msg: String
    },
    data() {
        return {
            code: "int a = 1; int b = 2; real c = 3.0 ;\n{\n\ta = a + 1 ;\n\tb = b * a ;\n\tif ( a < b ) \n\tthen c = c / 2 ;\n\telse c = c / 4 ;\n}",
            log_string: ""
        }
    },
    mounted() {
        this.code = this.$store.state.code
        // this.code = "real a = 3e3; {}"
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
        getLRProductionRule()
        getLRAnalyzeTable()
    },
    methods: {
        commitCode() {
            if(this.code === '') {
                // TODO 空处理
                return
            }
            this.$store.commit('setCode', this.code)
            let lex_attrs = lexicalAnalyzer(this.code)
            this.$store.commit('setLexAttrs', lex_attrs)
            let syntax_ast = syntaxAnalyzer($.extend([], lex_attrs))
            this.$store.commit('setSyntaxAst', syntax_ast)
            console.log(syntax_ast)
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