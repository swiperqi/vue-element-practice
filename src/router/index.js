import Router from 'vue-router'

export default new Router({
    routes: [{
        path: '/',
        redirect: '/home'
    }, {
        path: '/home',
        component: () => import('@/views/home')
    }, {
        path: '/private-self',
        component: () => import('@/views/private-self')
    }]
})