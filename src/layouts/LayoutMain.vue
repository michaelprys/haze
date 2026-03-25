<script setup lang="ts">
import Logo from 'assets/images/logo.webp';
import BaseBackground from 'components/base/BaseBackground.vue';
import { useQuasar } from 'quasar';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth();

const handleSignOut = async () => {
    try {
        await storeAuth.signOut();

        $q.notify({
            type: 'positive',
            message: 'Signed out successfully',
        });

        await router.push({ name: 'sign-in' });
    } catch (error) {
        const message = handleError(error);
        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing out',
        });
    }
};
</script>

<template>
    <q-layout class="main" view="lHh Lpr lFf">
        <q-header class="main__header" bordered height-hint="4rem">
            <q-toolbar class="main__container">
                <q-btn
                    class="main__logo no-hover-effect"
                    dense
                    flat
                    :ripple="false"
                    :to="{ name: 'home' }">
                    <img
                        class="main__logo-img"
                        alt="Haze logo"
                        :src="Logo"
                        width="70"
                        height="70"
                        loading="eager"
                        fetchpriority="high" />
                </q-btn>

                <q-space />

                <q-btn
                    class="main__title no-hover-effect"
                    flat
                    no-caps
                    :ripple="false"
                    :to="{ name: 'home' }">
                    Haze
                </q-btn>

                <q-space />

                <div class="main__header-buttons">
                    <q-btn
                        v-if="storeAuth.isLoggedIn"
                        class="main__header-icon"
                        flat
                        icon="logout"
                        round
                        @click="handleSignOut" />

                    <q-btn
                        v-else
                        class="main__header-icon"
                        flat
                        icon="account_circle"
                        round
                        :to="{ name: 'sign-in' }" />
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container class="main__page-container">
            <BaseBackground />

            <router-view v-slot="{ Component, route: currentRoute }">
                <transition appear mode="out-in" name="fade">
                    <component :is="Component" :key="currentRoute.path" />
                </transition>
            </router-view>
        </q-page-container>

        <q-footer
            v-if="route.meta.requiresAuth && storeAuth.isLoggedIn"
            bordered
            class="main__footer">
            <q-tabs
                class="main__footer-tabs"
                active-color="orange"
                align="justify"
                indicator-color="transparent">
                <q-route-tab icon="fa-solid fa-home" :to="{ name: 'home' }" />
                <q-route-tab icon="fa-solid fa-camera" :to="{ name: 'camera-page' }" />
            </q-tabs>
        </q-footer>
    </q-layout>
</template>

<style lang="scss" scoped>
.main {
    &__header {
        backdrop-filter: blur(0.75rem);
        background: $dark;
        border-bottom: 0.0625rem solid rgb(var(--q-primary-rgb), 0.2);

        &-buttons {
            display: flex;
        }

        &-icon {
            color: $primary;
        }
    }

    &__toolbar {
        min-height: 4rem;
        height: 4rem;
    }

    &__logo {
        min-width: auto;
        padding: 0.25rem;

        &:hover .main__logo-img {
            transform: scale(1.05);
        }

        &-img {
            width: 4.375rem;
            height: 4.375rem;
            transition: transform 0.3s ease;
        }
    }

    &__title {
        position: absolute;
        transform: translate(-50%, -50%);
        font-family: Streamster, sans-serif;
        font-size: 1.5rem;
        line-height: 1;
        letter-spacing: 0.125rem;
        color: $primary;
        transition: text-shadow 0.2s ease;
        top: 50%;
        left: 50%;
        will-change: text-shadow;

        &:hover {
            text-shadow:
                0 0 0 rgb(255 120 0 / 100%),
                0 0 0.375rem rgb(255 90 0 / 90%),
                0 0 0.625rem rgb(255 60 0 / 0%);
        }
    }

    &__footer {
        display: none;
        backdrop-filter: blur(0.75rem);
        background: $dark;
        border-top: 0.0625rem solid rgb(var(--q-primary-rgb), 0.2);

        &-tabs {
            width: 100%;
        }

        @media (width <= 55rem) {
            display: block;
        }
    }

    &__page-container {
        min-height: 100svh;
        background: radial-gradient(circle at top, var(--q-dark-page), var(--q-dark) 70%);
    }
}

.no-hover-effect {
    &:hover {
        background-color: transparent;
    }

    :deep(.q-focus-helper) {
        display: none;
    }
}
</style>
