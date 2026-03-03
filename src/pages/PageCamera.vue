<script setup lang="ts">
import { ref } from 'vue';
import { uid } from 'quasar';

const post = ref({
    id: uid(),
    caption: '',
    location: '',
    photo: null,
    date: Date.now(),
});
</script>

<template>
    <q-page class="haze-bg q-pa-md">
        <q-card class="post-card q-pa-lg">
            <div class="camera-frame">
                <q-img
                    src="https://unsplash.it/500"
                    class="post-image"
                    width="500"
                    height="500"
                    fit="cover"
                />
            </div>

            <div class="text-center q-mt-lg">
                <q-btn round icon="camera_alt" size="lg" class="camera-btn" unelevated />
            </div>

            <q-input
                v-model="post.caption"
                label="Caption"
                dense
                dark
                outlined
                class="q-mt-lg input-style"
            />

            <q-input
                v-model="post.location"
                label="Location"
                dense
                dark
                outlined
                class="q-mt-md input-style"
            >
                <template v-slot:append>
                    <q-icon name="place" class="text-orange" />
                </template>
            </q-input>

            <div class="q-mt-xl">
                <q-btn label="Publish" class="post-btn full-width" unelevated size="md" />
            </div>
        </q-card>
    </q-page>
</template>

<style lang="scss">
.haze-bg {
    background: radial-gradient(circle at top, #1a1a1a, #0d0d0d 70%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 1.75rem;
}

.post-card {
    background: #111;
    border-radius: 1.5rem;
    box-shadow: 0 1.25rem 3.75rem rgba(0, 0, 0, 0.6);
    width: 100%;
    max-width: 45rem;
}

.camera-frame {
    width: 100%;
    max-width: 35rem;
    margin: 0 auto;
    border-radius: 1rem;
    box-shadow: 0 0 1.875rem rgba(255, 120, 0, 0.18);
}

.post-image {
    width: 100%;
    border-radius: 1rem;
    max-height: 25rem;
}

.camera-btn {
    background: linear-gradient(135deg, rgba(255, 122, 0, 0.8), rgba(255, 60, 0, 0.8)) !important;
    color: white;
    //box-shadow: 0 0 1.5625rem rgba(255, 120, 0, 0.5);
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
}

.input-style {
    .q-field__control {
        background: #1b1b1b;
        border-radius: 0.875rem;
    }

    .q-field__label {
        color: #ff9a3c;
    }

    .q-field__control::before,
    .q-field__control::after {
        border-color: rgba(255, 154, 60, 0.3) !important;
    }
}

.post-btn {
    background: linear-gradient(90deg, #ff7a00, #ff3c00, #000) !important;
    color: white;
    font-weight: 700;
    border-radius: 999px;
    letter-spacing: 0.0625rem;
    text-transform: uppercase;
    transition: all 0.3s ease;
}
</style>
