import Vue from 'vue'
import VueRouter from 'vue-router'

const main_page = () => import('@/view/mainPage/mainPage')

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
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router