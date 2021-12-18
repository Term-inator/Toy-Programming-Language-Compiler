import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        lex_attrs: [],
        syntax_ast: null
    },
    mutations: {
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