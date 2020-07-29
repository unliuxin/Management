import Vue from 'vue'
import VueRouter from 'vue-router'



import Login from '../components/login/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../views/home/homeChild/Welcome.vue'
import Users from '../views/users/Users.vue'
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

        ]
    }


]

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
        console.log(tokenStr);
        if (!tokenStr) {
            next('/login')
        } else {
            next()
        }
    }
})

export default router