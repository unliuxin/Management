import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import axios from 'axios'
import echarts from 'echarts'
import vueTable from 'vue-table-with-tree-grid'


axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'

Vue.component('table-tree', vueTable)

//axios拦截请求
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //为请求对象添加token验证的Authorization
    return config
})



Vue.prototype.$http = axios
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router
}).$mount('#app')