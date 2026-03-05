<script setup lang="ts">
import { ref } from 'vue'
import { Dark } from 'quasar'

const isLoggedIn = ref(false)

const isDark = ref(Dark.isActive)

const toggleTheme = () => {
    Dark.set(!Dark.isActive)
    isDark.value = Dark.isActive
}
</script>

<template>
    <q-layout view="lHh Lpr lFf" class="app-layout">
        <q-header class="app-header" bordered height-hint="4rem">
            <q-toolbar class="constrain" style="height: 4rem; min-height: 4rem">
                <q-btn
                    class="logo-btn no-hover-effect"
                    :ripple="false"
                    :to="{ name: 'home' }"
                    flat
                    dense
                >
                    <img src="src/assets/logo.webp" width="1024" class="logo" alt="Haze logo" />
                </q-btn>

                <q-space />

                <q-btn :to="{ name: 'home' }" class="title no-hover-effect" :ripple="false" no-caps
                    >Haze</q-btn
                >

                <q-space />

                <div class="flex q-gutter-x-xs">
                    <q-btn
                        round
                        flat
                        :icon="isDark ? 'light_mode' : 'dark_mode'"
                        class="header-icon"
                        @click="toggleTheme"
                    />

                    <q-btn round flat :icon="isLoggedIn ? 'user' : 'logout'" class="header-icon" />
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container class="page-container">
            <router-view />
        </q-page-container>

        <q-footer class="app-footer small-screen-only" bordered>
            <q-tabs
                class="tabs"
                indicator-color="transparent"
                active-color="orange"
                align="justify"
            >
                <q-route-tab :to="{ name: 'home' }" icon="fa-solid fa-house" />
                <q-route-tab :to="{ name: 'camera' }" icon="fa-solid fa-camera" />
            </q-tabs>
        </q-footer>
    </q-layout>
</template>

<style lang="sass">
.app-header
    display: flex
    justify-content: center
    align-items: center
    min-height: 5rem !important
    background: var(--q-dark)
    backdrop-filter: blur(0.75rem)
    border-bottom: 0.0625rem solid rgba(var(--q-primary-rgb), 0.2)

.app-header .q-toolbar
    min-height: 4rem
    align-items: center

.logo
    width: 4.375rem
    transition: transform 0.3s ease

.logo-btn:hover .logo
    transform: scale(1.05)

.logo-btn
    padding: 0.25rem !important
    min-width: auto !important

.logo-btn img
    margin-left: 0.1875rem
    margin-top: 0.3125rem

.title
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    font-size: 1.5rem
    font-family: 'Streamster'
    letter-spacing: 0.125rem
    line-height: 1
    color: var(--q-primary)

.title::before
    display: none

.header-icon
    color: var(--q-primary)

.page-container
    background: radial-gradient(circle at top, var(--q-dark-page), var(--q-dark) 70%)
    min-height: 100vh

.app-footer
    background: var(--q-dark)
    backdrop-filter: blur(0.75rem)
    border-top: 0.0625rem solid rgba(var(--q-primary-rgb), 0.2)

//.tabs .q-tab {
//    color: var(--q-info)
//    transition: 0.3s ease
//}
//
//.tabs .q-tab--active {
//    color: var(--q-primary) !important
//}

.no-hover-effect
    .q-focus-helper
        display: none !important

    &:hover
        background: transparent !important
</style>
