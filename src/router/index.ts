import { defineRouter } from '#q-app/wrappers';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useStoreAuth } from 'stores/auth.store';
import { supabase } from 'src/api/supabaseClient';
import { getRecoveryToken } from 'src/utils/getRecoveryToken.utils';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either composables
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === 'history'
          ? createWebHistory
          : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach(async (to) => {
        const storeAuth = useStoreAuth();

        if (!storeAuth.isAuthenticated) {
            try {
                const { data } = await supabase.auth.getUser();

                if (data.user) {
                    storeAuth.user = data.user ?? null;
                }
            } catch {
                void 0;
            }
        }

        const requiresAuth = to.matched.some((r) => r.meta.requiresAuth),
            confirmOnly = to.matched.some((r) => r.meta.confirmOnly),
            guestOnly = to.matched.some((r) => r.meta.guestOnly),
            tokenInUrl = getRecoveryToken();

        if (to.name === 'reset-password' && !tokenInUrl) {
            return {
                name: 'forgot-password',
                replace: true,
            };
        }

        if (!storeAuth.isAuthenticated && requiresAuth) {
            return {
                name: 'sign-in',
                query: { next: to.fullPath },
                replace: true,
            };
        }

        if (storeAuth.isAuthenticated && guestOnly) {
            return { name: 'home' };
        }

        if (storeAuth.isAuthenticated && confirmOnly) {
            return true;
        }

        return true;
    });

    return Router;
});
