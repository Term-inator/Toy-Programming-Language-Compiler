<template>
    <div class='mainpage'>
        <div class='main'>
            <Input id='workspace' v-model='code' type='textarea' :rows='20' placeholder='Enter your code...' />
            <Button @click='commitCode'>提交</Button>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import {lexicalAnalyzer} from '@/compiler/lex'

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            code: ""
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
    },
    methods: {
        commitCode() {
            // let s = "if(a)then 1else {b = c}"
            console.log(lexicalAnalyzer(this.code))
        }
    }
}
</script>

<style>
.mainpage {
    min-height: 88vh;
    padding: 8vh 0 10vh 0;
}

textarea {
    resize: none;
}
</style>