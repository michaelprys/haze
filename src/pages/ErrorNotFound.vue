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
                :to="{ name: 'home' }"
            />
        </div>

        <div class="section__bg"></div>
    </section>
</template>

<style lang="scss" scoped>
.section {
    display: grid;
    min-height: 100svh;
    place-items: center;
    position: relative;
    text-align: center;

    &__bg {
        background-image: url('src/assets/cosmos.avif');
        background-size: cover;
        filter: contrast(2) grayscale(1);
        inset: 0;
        opacity: 0.2;
        pointer-events: none;
        position: absolute;
    }
}
</style>
