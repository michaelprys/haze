<script setup lang="ts">
defineProps({
    label: { type: String, default: '' },
    to: { type: [String, Object], default: undefined },
    icon: { type: String, default: undefined },
    loading: Boolean,
});
</script>

<template>
    <q-btn class="button" :icon="icon" :label="label" :loading="loading" :to="to" unelevated>
        <template #loading>
            <q-spinner />
        </template>
    </q-btn>
</template>

<style lang="scss" scoped>
.button {
    width: 100%;
    font-weight: 600;
    background: linear-gradient(135deg, #ffb347, #ff7a00, #ff3d00, #ffb347);
    background-size: 400% 400%;
    color: white;
    animation: gradient 5s ease infinite;
    border-radius: 62.4375rem;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
