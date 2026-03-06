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
    imageCaptured,
    imagePicked,
    pickerModel,
    videoRef,
    canvasRef,
    initCamera,
    captureImage,
    deactivateCamera,
    getImageSrc,
} = useCamera(post)

// Geolocation
const { locationPending, hasGeolocation, getLocation } = useGeolocation(post)

// Hooks
onMounted(() => {
    void initCamera()
})

onBeforeUnmount(() => {
    if (hasCameraSupport.value) {
        deactivateCamera()
    }
})
</script>

<template>
    <q-page class="haze-bg q-pa-md">
        <q-card class="post-card q-pa-lg">
            <div class="camera-frame">
                <video
                    v-show="!imageCaptured && !imagePicked && hasCameraSupport"
                    class="full-width"
                    ref="videoRef"
                    autoplay
                    playsinline
                />
                <canvas v-show="imageCaptured" class="full-width" height="240" ref="canvasRef" />

                <div
                    class="camera-placeholder"
                    style="
                        height: 350px;
                        object-fit: cover;
                        width: 100%;
                        background: linear-gradient(
                            to bottom right,
                            #4b0082,
                            #9c0f5f,
                            #c71585,
                            #ff4500
                        );
                        overflow: hidden;
                    "
                >
                    <q-img v-show="imagePicked" :src="post.photoUrl" alt="Attached photo" />
                </div>
            </div>

            <div class="text-center q-mt-lg">
                <q-btn
                    v-if="hasCameraSupport"
                    round
                    icon="camera_alt"
                    size="lg"
                    class="camera-btn"
                    unelevated
                    @click="captureImage"
                />

                <q-file
                    class="text-center"
                    style="margin-left: 3px"
                    v-else
                    @update:model-value="getImageSrc"
                    v-model="pickerModel"
                    borderless
                    label="Choose an image"
                />
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
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    max-width: 35rem
    margin: 0 auto
    border-radius: 1rem
    box-shadow: 0 0 1.875rem rgba(255, 120, 0, 0.18)

.camera-placeholder
    border-radius: 0.8rem

.post-image
    width: 100%
    border-radius: 1rem
    max-height: 25rem

.camera-btn
    background: linear-gradient(135deg, rgba(255, 122, 0, 0.8), rgba(255, 60, 0, 0.8)) !important
    color: white
    transition: transform 0.2s ease

    &:hover
        transform: scale(1.1)

.input-style
    .q-field__control
        background: #1b1b1b
        border-radius: 0.875rem

    .q-field__label
        color: #ff9a3c

    .q-field__control::before,
    .q-field__control::after
        border-color: rgba(255, 154, 60, 0.3) !important

.post-btn
    background: linear-gradient(90deg, #ff7a00, #ff3c00, #000) !important
    color: white
    font-weight: 700
    border-radius: 999px
    letter-spacing: 0.0625rem
    text-transform: uppercase
    transition: all 0.3s ease
</style>
