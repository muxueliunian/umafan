import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HOME.vue'
import UmaDashboard from '@/views/UmaDashBoard.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/dashiboard',
            name: 'dashiboard',
            component: UmaDashboard
        }
    ]
})

export default router
