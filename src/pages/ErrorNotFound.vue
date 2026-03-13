<script setup lang="ts"></script>

<template>
    <section class="section flex flex-center text-center">
        <div>
            <div class="text-h1">404</div>

            <div class="text-subtitle1 q-mt-sm" style="opacity: 0.7">empty as the void</div>

            <q-btn class="q-mt-xl auth-button" color="primary" outline label="Return" no-caps :to="{ name: 'home' }" />
        </div>

        <div class="bg"></div>
    </section>
</template>

<style lang="sass" scoped>
.section
    position: relative
    min-height: 100svh

.bg
    position: absolute
    inset: 0
    pointer-events: none
    background-image: url('src/assets/cosmos.avif')
    opacity: 0.2
    filter: contrast(2) grayscale(1)
    background-size: cover
</style>
