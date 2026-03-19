<script setup lang="ts"></script>

<template>
    <section class="section">
        <div>
            <div class="text-h1">404</div>

            <div class="text-subtitle1 q-mt-sm" style="opacity: 0.7">empty as the void</div>

            <q-btn
                class="q-mt-xl"
                color="primary"
                label="Return"
                no-caps
                outline
                :to="{ name: 'home' }" />
        </div>

        <div class="section__bg"></div>
    </section>
</template>

<style lang="scss" scoped>
.section {
    display: grid;
    place-items: center;
    position: relative;
    min-height: 100svh;
    text-align: center;

    &__bg {
        position: absolute;
        inset: 0;
        filter: contrast(2) grayscale(1);
        opacity: 0.2;
        background-image: url('images/cosmos.avif');
        background-size: cover;
        pointer-events: none;
    }
}
</style>
