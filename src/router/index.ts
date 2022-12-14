import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import registerRouteGuard from './Interceptor/index'

// import My from '@/views/my/Index.vue'

// 懒加载
const NotFind = () => import('@/components/404/Index.vue')
const Index = () => import('@/views/Index.vue')
const Home = () => import('@/views/home/Index.vue')

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFind
    },
    {
        path: '/',
        name: 'Index',
        component: Index,
        children: [
            {
                path: '',
                name: 'Camera',
                component: Home,
                meta: { title: '水印生成工具', requireLogin: false, isAdmin: true }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory('/camera-watermark/'),
    // history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

registerRouteGuard(router)

export default router
