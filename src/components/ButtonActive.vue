<script setup lang="ts">
defineProps({
    label: String,
    to: Object,
    icon: String,
    loading: Boolean,
})
</script>

<template>
    <q-btn :loading="loading" class="full-width create-btn" :icon="icon" :label="label" :to="to" unelevated>
        <template #loading>
            <q-spinner />
        </template>
    </q-btn>
</template>

<style lang="sass" scoped>

.create-btn
    background: linear-gradient(135deg, #ffb347, #ff7a00, #ff3d00, #ffb347)
    background-size: 400% 400%
    color: white
    font-weight: 600
    border-radius: 62.4375rem
    animation: gtaGradient 5s ease infinite

@keyframes gtaGradient
    0%
        background-position: 0% 50%
    50%
        background-position: 100% 50%
    100%
        background-position: 0% 50%
</style>
