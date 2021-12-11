<template>
  
</template>

<script>
import {lexicalAnalyzer} from "@/compiler/lex"

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
        let s = "if(a)then 1else {b = c}"
        console.log(lexicalAnalyzer(s))
    }
}
</script>

<style>

</style>