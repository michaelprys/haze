<script setup lang="ts"></script>

<template>
    <div class="auth-container fullscreen flex flex-center text-center">
        <div>
            <div class="text-h1">404</div>

            <div class="text-subtitle1 q-mt-sm" style="opacity: 0.7">Page not found</div>

            <q-btn class="q-mt-xl auth-button" label="Go Home" no-caps :to="{ name: 'home' }" />
        </div>
    </div>
</template>

<style scoped lang="sass">
.auth-container
    background-color: transparent
</style>
