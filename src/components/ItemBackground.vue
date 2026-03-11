<script setup lang="ts"></script>

<template>
    <div class="bg"><slot /></div>
</template>

<style lang="sass" scoped>
.bg
    position: absolute
    inset: 0
    padding: 1rem
    background: linear-gradient(170deg, #111111 0%, #121212 40%, #141414 70%, #16120a 90%, #111111 100%)
    background-size: cover
    width: 100%
    height: 100%
</style>
