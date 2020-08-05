import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' //进度条插件
import 'nprogress/nprogress.css'


import Login from '../components/login/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../views/home/homeChild/Welcome.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/rights/Rights.vue'
import Roles from '../views/roles/Roles.vue'
import Categories from "../views/goods/Categories.vue"
import Orders from "../views/orders/Orders.vue"
import Goods from "../views/goods/Goods.vue"


import Reports from '../views/reports/Reports.vue'
Vue.use(VueRouter)


const routes = [

    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Categories
            },
            {
                path: '/categories',
                component: Categories
            },
            {
                path: '/reports',
                component: Reports
            },
            {
                path: '/orders',
                component: Orders
            },
            {
                path: '/goods',
                component: Goods
            },

        ]
    }


]

//解决element ui导航栏中的vue-router3.0中重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    routes,
    mode: 'hash'
})

//为路由对象加上导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        //从sessionStorage获取token
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) {
            next('/login')
        } else {
            NProgress.start(); //进度条开启
            next()
        }
    }
    router.afterEach(transition => {
        NProgress.done(); //进度条关闭
    });
})

export default router