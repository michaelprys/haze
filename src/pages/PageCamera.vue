<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useCamera } from 'src/composables/useCamera'
import { usePost } from 'src/composables/usePost'
import ActionButton from 'components/ActionButton.vue'
import { useGeolocation } from 'src/composables/useGeolocation'

// Post
const { post, handlePublishPost } = usePost()

// Camera
const {
    hasCameraSupport,
    isCameraInitializing,
    isCameraActive,
    imageCaptured,
    cameraModel,
    videoRef,
    canvasRef,
    initCamera,
    captureImage,
    deactivateCamera,
    resumeCamera,
    getImageSrc,
    checkDevice,
} = useCamera(post)

// Camera loading

const onDeviceChange = () => {
    isCameraInitializing.value = true
    deactivateCamera()
    void checkDevice().finally(() => (isCameraInitializing.value = false))
}

const handleDeviceChange = () => {
    void onDeviceChange()
}

// Geolocation
const { locationPending, hasGeolocation, getLocation } = useGeolocation(post)

// Hooks
onMounted(() => {
    void initCamera()

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
})

onBeforeUnmount(() => {
    navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)

    if (hasCameraSupport.value) {
        deactivateCamera()
    }
})
</script>

<template>
    <q-page class="haze-bg q-pa-md">
        <q-card class="post-card q-pa-lg">
            <div class="camera-wrapper">
                <div class="camera-frame">
                    <div class="camera-frame">
                        <q-skeleton
                            v-if="isCameraInitializing"
                            class="camera-skeleton"
                            animation="wave"
                        />

                        <video
                            v-show="isCameraActive && !imageCaptured"
                            ref="videoRef"
                            autoplay
                            playsinline
                            class="camera-shot"
                        />
                        <canvas v-show="imageCaptured" ref="canvasRef" class="camera-shot" />

                        <q-img
                            v-if="!hasCameraSupport && post.photoUrl"
                            :src="post.photoUrl"
                            class="camera-shot"
                            fit="cover"
                            loading="eager"
                        />

                        <div
                            v-show="!isCameraActive && !post.photoUrl && !imageCaptured"
                            class="camera-placeholder"
                        />
                    </div>
                </div>
            </div>

            <div class="text-center q-mt-lg">
                <div v-if="hasCameraSupport">
                    <q-btn
                        v-if="hasCameraSupport && !imageCaptured"
                        round
                        icon="camera_alt"
                        size="lg"
                        class="camera-btn"
                        unelevated
                        @click="captureImage"
                    />

                    <q-btn
                        v-else-if="imageCaptured"
                        round
                        icon="replay"
                        size="lg"
                        class="camera-btn"
                        unelevated
                        @click="resumeCamera"
                    />
                </div>

                <q-file
                    v-else
                    v-model="cameraModel"
                    @update:model-value="getImageSrc"
                    dense
                    flat
                    class="image-link"
                >
                    <template #default>
                        <span class="image-link-text">+ add image</span>
                    </template>
                </q-file>
            </div>

            <q-input
                v-model="post.caption"
                label="Caption"
                dense
                dark
                outlined
                type="textarea"
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
                    <q-spinner
                        v-if="locationPending"
                        style="margin-right: 1.2rem"
                        color="orange"
                        size="18px"
                    ></q-spinner>

                    <q-btn
                        v-if="!locationPending && hasGeolocation"
                        @click="getLocation"
                        icon="place"
                        flat
                    />
                </template>
            </q-input>

            <div class="q-mt-xl">
                <ActionButton @click="handlePublishPost(hasCameraSupport)" label="Publish" />
            </div>
        </q-card>
    </q-page>
</template>

<style lang="sass">
.haze-bg
    min-height: 100vh
    display: flex
    justify-content: center
    align-items: flex-start
    padding-top: 1.75rem

.post-card
    border-radius: 1.5rem
    box-shadow: 0 1.25rem 3.75rem rgba(0, 0, 0, 0.6)
    width: 100%
    max-width: 45rem

.camera-frame
    position: relative
    overflow: hidden
    aspect-ratio: 3 / 2
    border-radius: 1.5rem
    width: 100%
    max-width: 35rem
    margin: 0 auto
    background: linear-gradient(180deg, #181818 0%, #0f0f0f 100%)
    box-shadow:  0 0.875rem 2.5rem rgba(0, 0, 0, 0.8),  0 0 0 0.0625rem rgba(255, 140, 0, 0.08)

.camera-shot
    position: absolute
    inset: 0
    z-index: 1
    object-fit: cover

.camera-placeholder
    position: absolute
    inset: 0
    z-index: 0
    object-fit: cover
    width: 100%
    height: 100%
    background: linear-gradient(to bottom right, #4b0082, #9c0f5f, #c71585, #ff4500)
    overflow: hidden

.camera-skeleton
    height: 100%

.post-image
    width: 100%
    border-radius: 1.5rem
    max-height: 25rem

.camera-btn
    background: linear-gradient(135deg, rgba(255, 122, 0, 0.8), rgba(255, 60, 0, 0.8))
    color: white
    transition: transform 0.2s ease

    &:hover
        transform: scale(1.1)

.image-link
    max-width: 13.75rem
    align-items: center
    .q-field__native
        display: none

    .q-field__control::before,
    .q-field__control::after
        display: none

    .q-field__control
        background: transparent
        box-shadow: none
        padding: 0
        min-height: auto

.image-link-text
    display: flex
    align-items: center
    cursor: pointer
    font-size: 1rem
    font-weight: 500
    letter-spacing: 0.05em
    color: #ff9a3c
    transition: all 0.25s ease
    text-shadow: 0 0 0.375rem rgba(255, 122, 0, 0.35)

    &:hover
        color: #ffb15c
        text-shadow: 0 0

.input-style
    .q-field__control
        background: #1b1b1b
        border-radius: 0.875rem

    .q-field__label
        color: #ff9a3c

    .q-field__control::before,
    .q-field__control::after
        border-color: rgba(255, 154, 60, 0.3)

    textarea
        scrollbar-width: thin
        scrollbar-color: rgba(255,154,60,0.45) transparent

        &::-webkit-scrollbar
            width: 0.375rem

        &::-webkit-scrollbar-track
            background: transparent

        &::-webkit-scrollbar-thumb
            background: rgba(255,154,60,0.45)
            border-radius: 62.4375rem

        &::-webkit-scrollbar-thumb:hover
            background: rgba(255,154,60,0.7)

.post-btn
    background: linear-gradient(90deg, #ff7a00, #ff3c00, #000)
    color: white
    font-weight: 700
    border-radius: 62.4375rem
    letter-spacing: 0.0625rem
    text-transform: uppercase
    transition: all 0.3s ease
</style>
