<script setup lang="ts"></script>

<template>
    <div class="bg">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.bg {
    background: linear-gradient(170deg, #111 0%, #121212 40%, #141414 70%, #16120a 90%, #111 100%);
    background-size: cover;
    height: 100%;
    inset: 0;
    padding: 1rem;
    position: absolute;
    width: 100%;
}
</style>
