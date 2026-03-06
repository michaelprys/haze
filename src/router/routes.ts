import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/LayoutMain.vue'),
        children: [
            { path: '', name: 'home', component: () => import('pages/PageHome.vue') },
            {
                path: 'camera-page',
                name: 'camera-page',
                component: () => import('pages/PageCamera.vue'),
            },
            {
                path: 'auth/sign-in',
                name: 'sign-in',
                component: () => import('pages/PageSignIn.vue'),
            },
            {
                path: 'auth/sign-up',
                name: 'sign-up',
                component: () => import('pages/PageSignUp.vue'),
            },
            {
                path: 'auth/forgot-password',
                name: 'forgot-password',
                component: () => import('pages/PageForgotPassword.vue'),
            },
            {
                path: 'auth/reset-password',
                name: 'reset-password',
                component: () => import('pages/PageResetPassword.vue'),
            },
            {
                path: 'auth/verify-email',
                name: 'verify-email',
                component: () => import('pages/PageVerifyEmail.vue'),
            },
            {
                path: 'auth/email-verification',
                name: 'email-verification',
                component: () => import('pages/PageEmailVerification.vue'),
            },
            // { path: '', redirect: { name: 'sign-in' } },
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
