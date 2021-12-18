import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        code: "int a = 1; int b = 2; real c = 3.0 ;\n{\n\ta = a + 1 ;\n\tb = b * a ;\n\tif ( a < b ) \n\tthen c = c / 2 ;\n\telse c = c / 4 ;\n}",
        lex_attrs: [],
        syntax_ast: null
    },
    mutations: {
        setCode(state, code) {
            state.code = code
        },
        setLexAttrs(state, lex_attrs) {
            state.lex_attrs = lex_attrs
        },
        setSyntaxAst(state, syntax_ast) {
            state.syntax_ast = syntax_ast
        }
    },
    actions: {},
    getters: {}

})

export default store