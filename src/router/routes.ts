import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/LayoutMain.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/PageHome.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'camera-page',
                name: 'camera-page',
                component: () => import('pages/PageCamera.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'auth/sign-in',
                name: 'sign-in',
                component: () => import('pages/PageSignIn.vue'),
                meta: { confirmOnly: true },
            },
            {
                path: 'auth/sign-up',
                name: 'sign-up',
                component: () => import('pages/PageSignUp.vue'),
                meta: { confirmOnly: true },
            },
            {
                path: 'auth/forgot-password',
                name: 'forgot-password',
                component: () => import('pages/PageForgotPassword.vue'),
                meta: { confirmOnly: true },
            },
            {
                path: 'auth/reset-password',
                name: 'reset-password',
                component: () => import('pages/PageResetPassword.vue'),
                meta: { confirmOnly: true },
            },
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
