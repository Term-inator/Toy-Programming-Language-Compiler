<template>
    <div class='tokenpage'>
        <div class='main'>
            <Table height="500" :columns="token_header" :data="token_data" size='large' className='column'></Table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tokenPAge',
    props: {
        msg: String
    },
    data() {
        return {
            token_header: [
                {
                    title: 'tokentype',
                    key: 'token_type'
                },
                {
                    title: 'attributevalue',
                    key: 'attr_val'
                },
                {
                    title: 'linenumber',
                    key: 'line_num'
                },
                {
                    title: 'linepos',
                    key: 'line_pos'
                }
            ],
            token_data: []
        }
    },
    mounted() {
        if(this.$store.state.lex_attrs === null) {
            console.log("lex_attr is null")
        }
        else {
            this.token_data = []
            this.generateTokenData()
        }
    },
    methods: {
        generateTokenData() {
            this.$store.state.lex_attrs.forEach((token) => {
                let token_obj = {}
                for(let k in token) {
                    token_obj[k] = token[k]
                }
                this.token_data.push(token_obj)
            })
        }
    }
}
</script>

<style scoped>
@import "../../assets/css/base.css";

.tokenpage {
    min-height: 88vh;
    max-height: 88vh;
    padding: 8vh 0 10vh 0;
}

.tokenpage .main {
    padding: 6vh 10vw 0 10vw;
}
</style>
