<script setup lang="ts">
import Logo from 'src/assets/logo.webp'

// import { ref } from 'vue'
// import { Dark } from 'quasar'
import { useStoreAuth } from 'stores/auth.store'
import { useQuasar } from 'quasar'
import handleError from 'src/utils/handleError.utils'
import { useRoute, useRouter } from 'vue-router'
import ItemBackground from 'components/ItemBackground.vue'

const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth()
//  isDark = ref(Dark.isActive)

const handleSignOut = async () => {
    try {
        await storeAuth.signOut()

        $q.notify({
            type: 'positive',
            message: 'Signed out successfully',
        })

        await router.push({ name: 'sign-in' })
    } catch (error) {
        const message = handleError(error)
        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing out',
        })
    }
}

// const toggleTheme = () => {
//     Dark.set(!Dark.isActive)
//     isDark.value = Dark.isActive
// }
</script>

<template>
    <q-layout view="lHh Lpr lFf" class="app-layout">
        <q-header class="app-header" bordered height-hint="4rem">
            <q-toolbar class="container" style="height: 4rem; min-height: 4rem">
                <q-btn class="logo-btn no-hover-effect" :ripple="false" :to="{ name: 'home' }" flat dense>
                    <img :src="Logo" width="1024" class="logo" alt="Haze logo" />
                </q-btn>

                <q-space />

                <q-btn :to="{ name: 'home' }" class="title no-hover-effect" :ripple="false" no-caps flat>Haze</q-btn>

                <q-space />

                <div class="flex">
                    <!--                    <q-btn-->
                    <!--                        round-->
                    <!--                        flat-->
                    <!--                        :icon="isDark ? 'light_mode' : 'dark_mode'"-->
                    <!--                        class="header-icon"-->
                    <!--                        @click="toggleTheme"-->
                    <!--                    />-->

                    <q-btn
                        v-if="storeAuth.isAuthenticated"
                        @click="handleSignOut"
                        round
                        flat
                        icon="logout"
                        class="header-icon"
                    />

                    <q-btn v-else :to="{ name: 'sign-in' }" round flat icon="account_circle" class="header-icon" />
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container class="page-container">
            <ItemBackground />

            <router-view v-slot="{ Component, route }">
                <transition name="fade" mode="out-in" appear>
                    <component :is="Component" :key="route.path" />
                </transition>
            </router-view>
        </q-page-container>

        <q-footer v-if="route.meta.requiresAuth && storeAuth.isAuthenticated" class="app-footer" bordered>
            <q-tabs class="tabs" indicator-color="transparent" active-color="orange" align="justify">
                <q-route-tab :to="{ name: 'home' }" icon="fa-solid fa-home" />
                <q-route-tab :to="{ name: 'camera-page' }" icon="fa-solid fa-camera" />
            </q-tabs>
        </q-footer>
    </q-layout>
</template>

<style lang="sass" scoped>
.page-container
    background: radial-gradient(circle at top, var(--q-dark-page), var(--q-dark) 70%)
    min-height: 100svh

.app-header
    display: flex
    justify-content: center
    align-items: center
    min-height: 5rem
    background: $dark
    backdrop-filter: blur(0.75rem)
    border-bottom: 0.0625rem solid rgba(var(--q-primary), 0.2)

.app-header .q-toolbar
    min-height: 4rem
    align-items: center

.logo
    width: 4.375rem
    transition: transform 0.3s ease

.logo-btn:hover .logo
    transform: scale(1.05)

.logo-btn
    padding: 0.25rem
    min-width: auto

.logo-btn img
    margin-left: 0.1875rem
    margin-top: 0.3125rem

.title
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    font-size: 1.5rem
    font-family: 'Streamster', sans-serif
    letter-spacing: 0.125rem
    line-height: 1
    color: $primary
    transition: text-shadow 0.2s ease
    will-change: text-shadow

    &:hover
        text-shadow: 0 0 0 rgba(255, 120, 0, 1), 0 0 0.375rem rgba(255, 90, 0, 0.9), 0 0 0.625rem rgba(255, 60, 0, 0)

.header-icon
    color: $primary

.app-footer
    display: none
    background: $dark
    backdrop-filter: blur(0.75rem)
    border-top: 0.0625rem solid rgba(var(--q-primary-rgb), 0.2)

.no-hover-effect
    :deep(.q-focus-helper)
        display: none

    &:hover
        background-color: transparent

@media (width <= 55rem)
    .app-footer
        display: block
</style>
