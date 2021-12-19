<template>
    <div class='astpage'>
        <div class='main'>
            <Row>
                <Button size='large' @click='reloadTree'>重新加载</Button>
            </Row>
            <Row>
                <svg></svg>
            </Row>
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
            svg_width: '90vw',
            svg_height: '80vh',
            simple_ast: null,
            tree_height: 0,
            tree_width: 0
        }
    },
    mounted() {
        d3.select('svg')
            .attr('width', this.svg_width)
            .attr('height', this.svg_height)
            .style('border', '2px solid rgba(0, 0, 0, .3)')
            .style('border-radius', '10px')
        if(this.$store.state.syntax_ast === null) {
            console.log("ast is null")
        }
        else {
            this.getSimpleAst()
            this.generateAstTree()
        }
    },
    methods: {
        reloadTree() {
            d3.select('g').remove()
            this.tree_width = 0
            this.tree_height = 0
            this.getSimpleAst()
            this.generateAstTree()
        },
        getSimpleAst() {
            this.simple_ast = this.generateSimpleAst(this.$store.state.syntax_ast)
            console.log(this.simple_ast)
        },
        generateSimpleAst(root) {
            let node = {val: 0, children: null}
            if(root.children !== null) {
                ++this.tree_height
                let new_children = []
                root.children.forEach((node) => {
                    new_children.push(this.generateSimpleAst(node))
                })
                node.children = new_children
            }
            ++this.tree_width
            if(root.type === 0) {
                node.val = root.val.attr_val
            }
            else if(root.type === 1) {
                node.val = root.val.left
            }
            return node
        },
        generateAstTree() {
            let tree_group = d3.select('svg')
                                .append('g')

            d3.select('svg')
                .call(d3.behavior.zoom().on('zoom', () => {
                    tree_group.attr("transform", "translate("  +d3.event.translate + ")scale(" +d3.event.scale + ")")
                }))

            let tree = d3.layout.tree()
                        .size([this.tree_width * 30, this.tree_height * 30])
                        .separation((a, b) => {
                            return (a.parent == b.parent ? 1 : 2)
                        })

            let diagonal = d3.svg.diagonal()
                            .projection((d) => {
                                return [d.x, d.y];
                            })

            let nodes = tree.nodes(this.simple_ast)
            let links = tree.links(nodes)

            let link = tree_group.selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("d", diagonal)
                .style('fill', 'none')
                .style('stroke', 'steelblue')
                .style('stroke-width', '1.5px')

            let node = tree_group.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("transform", (d) => {
                    return "translate(" + d.x + "," + d.y + ")";
                })

            node.append("circle")
                .attr("r", 20)
                .style('fill', 'white')
                .style('stroke', 'steelblue')
                .style('stroke-width', '1.5px')

            node.append("text")
                .attr("dy", 3)
                .style("text-anchor", 'middle')
                .text((d) => {
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
    padding: 4vh 5vw 0 5vw;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}
</style>