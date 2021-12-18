<template>
    <div class='astpage'>
        <div class='main'>
            
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: 'astPAge',
    props: {
        msg: String
    },
    data() {
        return {
            svg: null,
            simple_ast: null
        }
    },
    mounted() {
        this.svg = d3.select('.main')
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
        console.log(this.svg)
        this.getSimpleAst()
        this.generateAstTree()
    },
    methods: {
        getSimpleAst() {
            if(this.$store.state.syntax_ast === null) {
                console.log("ast is null")
                return
            }
            this.simple_ast = this.generateSimpleAst(this.$store.state.syntax_ast)
            console.log(this.simple_ast)
        },
        generateSimpleAst(root) {
            let node = {val: 0, children: null}
            if(root.children !== null) {
                let new_children = []
                root.children.forEach((node) => {
                    new_children.push(this.generateSimpleAst(node))
                })
                node.children = new_children
            }
            if(root.type === 0) {
                node.val = root.val.attr_val
            }
            else if(root.type === 1) {
                node.val = root.val.left
            }
            return node
        },
        generateAstTree() {
            let tree = d3.layout.tree()
                        .size([2000, 1500])
                        .separation((a, b) => {
                            return (a.parent == b.parent ? 1 : 2)
                        })

            let diagonal = d3.svg.diagonal()
                            .projection(function (d) {
                                return [d.x, d.y];
                            })

            let nodes = tree.nodes(this.simple_ast)
            let links = tree.links(nodes)

            let link = d3.select('svg').selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", diagonal)

            let node = d3.select('svg').selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })

            // node.append("circle")
            //     .attr("r", 10)
            //     .style('fill', 'none')

            node.append("text")
                // .attr("dx", function (d) {
                //     return d.children ? -8 : 8;
                // })
                .attr("dy", 3)
                // .style("text-anchor", function (d) {
                //     return d.children ? "end" : "start";
                // })
                .text(function (d) {
                    return d.val;
                });
        }
    }
}
</script>

<style scoped>
@import "../../assets/css/base.css";

.astpage {
    height: 88vh;
    min-height: 88vh;
    padding: 8vh 0 10vh 0;
}

.astpage .main {
    height: inherit;
    padding: 5vh 5vw 0 5vw;
}

.node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
}

.node {
    font: 12px sans-serif;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}
</style>