<template>
    <div class="bg">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(170deg, #111 0%, #121212 40%, #141414 70%, #16120a 90%, #111 100%);
    background-size: cover;
    padding: 1rem;
}
</style>
