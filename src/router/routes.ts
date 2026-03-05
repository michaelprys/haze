import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', name: 'home', component: () => import('pages/PageHome.vue') },
            { path: '/camera', name: 'camera', component: () => import('pages/PageCamera.vue') },
            { path: '/sign-in', name: 'sign-in', component: () => import('pages/PageSignIn.vue') },
            { path: '/sign-up', name: 'sign-up', component: () => import('pages/PageSignUp.vue') },
            { path: '', redirect: { name: 'sign-in' } },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
]

export default routes
