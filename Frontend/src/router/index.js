import Vue from 'vue'
import VueRouter from 'vue-router'

const main_page = () => import('@/view/mainPage/mainPage')
const ast_page = () => import('@/view/astPage/astPage')

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/mainpage'
    },
    {
        name: 'mainpage',
        path: '/mainpage',
        component: main_page
    },
    {
        name: 'astPage',
        path: '/astPage',
        component: ast_page
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router