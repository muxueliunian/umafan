import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HOME.vue'
import UmaDashboard from '@/views/UmaDashBoard.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'UmaFan - 赛马娘攻略与数据查询中心'
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: UmaDashboard,
            meta: {
                title: '粉丝数据查询 - UmaFan Dashboard'
            }
        }
    ]
})

router.beforeEach((to, _from, next) => {
    document.title = (to.meta.title as string) || 'UmaFan';
    next();
});

export default router
