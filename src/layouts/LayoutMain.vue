<script setup lang="ts">
import BaseBackground from 'components/base/BaseBackground.vue';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import Logo from 'assets/images/logo.webp';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth();

const isLogoLoaded = ref(false);

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
                    <div class="logo-container">
                        <div v-if="!isLogoLoaded" class="logo-skeleton" />
                        <img
                            class="main__logo-img"
                            :class="{ 'main__logo-img--loaded': isLogoLoaded }"
                            alt="Haze logo"
                            :src="Logo"
                            width="70"
                            height="70"
                            loading="eager"
                            fetchpriority="high"
                            @load="isLogoLoaded = true" />
                    </div>
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

    &__logo {
        min-width: auto;
        padding: 0.25rem;

        &:hover .main__logo-img {
            transform: scale(1.05);
        }

        &-img {
            width: 4.375rem;
            height: 4.375rem;
            opacity: 0;
            transition:
                transform 0.3s ease,
                opacity 0.4s ease;

            &--loaded {
                opacity: 1;
            }
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

    &__page-container {
        min-height: 100svh;
        background: radial-gradient(circle at top, var(--q-dark-page), var(--q-dark) 70%);
    }
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 4.375rem;
    height: 4.375rem;
}

.logo-skeleton {
    position: absolute;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: rgba($primary, 0.1);
    animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(0.95);
        opacity: 0.3;
    }

    50% {
        transform: scale(1);
        opacity: 0.6;
    }
}

.no-hover-effect {
    &:hover {
        background-color: transparent;
    }
}

:deep(.q-focus-helper) {
    display: none;
}
</style>
