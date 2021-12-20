<template>
    <div class='mainpage'>
        <div class='main'>
            <Row type='flex' justify='space-around' style='padding: 4vh 0 0 0'>
                <Col span='14'>
                    <Row>
                        <Button type='success' size='large' @click='commitCode'>提交</Button>
                    </Row>
                    <br>
                    <Row>
                        <Input id='work-space' v-model='code' type='textarea' :rows='16' placeholder='Enter your code...' />
                    </Row>  
                </Col>
                <Col span='8'>
                    <Tabs value="res">
                        <TabPane :label="res" name="res">
                            <div style="height: 80vh;">
                                <Input id='res-space' v-model='res_string' type='textarea' :rows='16' readonly />
                            </div>
                        </TabPane>
                        <TabPane :label="err" name="err">
                            <div style="height: 80vh;">
                                <Input id='err-space' v-model='err_string' type='textarea' :rows='16' readonly />
                            </div>
                        </TabPane>
                    </Tabs>
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
            res_string: "",
            err_string: "",
            res: (h) => {
                    return h('div', [
                        h('span', '结果')
                    ])
                },
            err: (h) => {
                return h('div', [
                    h('span', '报错'),
                    h('Badge', {
                        props: {
                            count: this.$store.state.errors.length
                        }
                    })
                ])
            }
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
        this.showResult()
        this.showError()
        getLRProductionRule()
        getLRAnalyzeTable()
    },
    methods: {
        commitCode() {
            if(this.code === '') {
                // TODO 空处理
                return
            }
            let res = null
            let errors = []
            this.$store.commit('setSyntaxAst', null)
            this.$store.commit('resetErrors')
            this.res_string = ""
            this.err_string = ""
            this.$store.commit('setCode', this.code)
            res = lexicalAnalyzer(this.code)
            let lex_attrs = res.tokens
            this.$store.commit('setLexAttrs', lex_attrs)
            errors = res.errors
            if(errors.length !== 0) {
                this.$store.commit('addErrors', errors)
                this.showError()
                this.$Notice.error({
                    title: '编译失败',
                });
                return
            }

            res = syntaxAnalyzer($.extend([], lex_attrs))
            let syntax_ast = res.ast
            if(syntax_ast !== null) { // succeed
                this.$Notice.success({
                    title: '编译成功',
                })
                this.$store.commit('setSyntaxAst', syntax_ast)
                let result = res.result
                this.$store.commit('setResult', result)
                this.showResult()
            }
            else {
                this.$Notice.error({
                    title: '编译失败',
                })
            }
            errors = res.errors
            if(errors.length !== 0) {
                this.$store.commit('addErrors', errors)
                this.showError()
                return
            }
        },
        showResult() {
            let result = this.$store.state.result
            let res = ""
            for(let k in result) {
                res += (k + ' : ' + result[k] + '\n')
            }
            this.res_string = res
        },
        showError() {
            let err = ""
            this.$store.state.errors.forEach((error) => {
                err += error.toString() + '\n'
            })
            this.err_string = err
        }
    }
}
</script>

<style scoped>
@import "../../assets/css/base.css";

.mainpage {
    min-height: 88vh;
    padding: 8vh 0 0vh 0;
}

#work-space /deep/ .ivu-input, #res-space /deep/ .ivu-input {
    font-size: 3vh;
    resize: none;
}

#err-space /deep/ .ivu-input {
    font-size: 3vh;
    resize: none;
    color: red;
}
</style>