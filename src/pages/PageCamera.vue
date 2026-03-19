<script setup lang="ts">
import BaseButton from 'components/base/BaseButton.vue';
import type { QForm } from 'quasar';
import { useCamera } from 'src/composables/useCamera';
import { useGeolocation } from 'src/composables/useGeolocation';
import { usePost } from 'src/composables/usePost';
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Post
const { post, loading, handlePublishPost } = usePost();

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
} = useCamera(post);

// Camera loading
const formRef = ref<QForm | null | undefined>(null);

const onDeviceChange = () => {
    isCameraInitializing.value = true;
    deactivateCamera();
    void checkDevice().finally(() => (isCameraInitializing.value = false));
};

const handleDeviceChange = () => {
    void onDeviceChange();
};

// Geolocation
const { locationPending, hasGeolocation, getLocation } = useGeolocation(post);

// Hooks
onMounted(() => {
    void initCamera();

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
});

onBeforeUnmount(() => {
    post.value = {
        id: '',
        caption: '',
        location: '',
        photoFile: null,
        photoUrl: '',
        takenAt: new Date().toISOString(),
    };

    navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);

    if (hasCameraSupport.value) {
        deactivateCamera();
    }
});
</script>

<template>
    <q-page class="camera haze-bg q-pa-md relative">
        <q-card class="camera__card q-pa-lg">
            <q-form
                @submit.prevent="handlePublishPost(hasCameraSupport, formRef)"
                class="camera__wrapper"
                ref="formRef">
                <div class="camera__frame">
                    <q-skeleton
                        v-if="isCameraInitializing"
                        animation="wave"
                        class="camera__skeleton" />

                    <video
                        v-show="isCameraActive && !imageCaptured"
                        ref="videoRef"
                        class="camera__shot"
                        autoplay
                        playsinline
                        :style="{
                            opacity: isCameraActive ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }" />
                    <canvas v-show="imageCaptured" ref="canvasRef" class="camera__shot" />

                    <q-img
                        v-if="!hasCameraSupport && post.photoUrl"
                        class="camera__shot"
                        fit="cover"
                        loading="eager"
                        :src="post.photoUrl" />

                    <div
                        v-show="!isCameraActive && !post.photoUrl && !imageCaptured"
                        class="camera__placeholder"
                        :style="{
                            opacity: isCameraActive ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                        }">
                        <div class="camera__placeholder-wrapper">
                            <span>
                                turn on your camera, or add a memory
                                <br />
                            </span>
                            <span class="camera__placeholder-subtitle">
                                to capture the moment...
                            </span>
                        </div>
                    </div>
                </div>

                <div class="camera__buttons">
                    <div class="camera__buttons-wrapper" v-if="hasCameraSupport">
                        <q-btn
                            v-if="hasCameraSupport && !imageCaptured"
                            class="camera__capture-button"
                            icon="camera_alt"
                            round
                            size="lg"
                            unelevated
                            @click="captureImage" />

                        <q-btn
                            v-else-if="imageCaptured"
                            class="camera__capture-button"
                            icon="replay"
                            round
                            size="lg"
                            unelevated
                            @click="resumeCamera" />
                    </div>

                    <q-file
                        v-else
                        v-model="cameraModel"
                        class="camera__filepicker q-mt-lg"
                        dense
                        flat
                        @update:model-value="getImageSrc">
                        <template #default>
                            <span class="camera__filepicker-text">+ add memory</span>
                        </template>
                    </q-file>
                </div>

                <q-input
                    v-model="post.caption"
                    class="camera__input q-mt-lg"
                    dark
                    dense
                    label="Caption"
                    outlined
                    type="textarea"
                    :rules="[
                        (val) => !!val || 'Caption is required',
                        (val) => val.length <= 200 || 'Maximum 200 characters',
                    ]" />

                <q-input
                    v-model="post.location"
                    class="camera__input"
                    dark
                    dense
                    label="Location"
                    outlined
                    :rules="[(val) => !!val || 'Location is required']">
                    <template #append>
                        <q-spinner
                            v-if="locationPending"
                            color="orange"
                            size="18px"
                            style="margin-right: 0.45rem" />

                        <q-btn
                            v-if="!locationPending && hasGeolocation"
                            class="camera__geo-button"
                            flat
                            @mousedown.stop.prevent
                            @click.stop.prevent="getLocation"
                            icon="place" />
                    </template>
                </q-input>

                <div class="camera__publish-button">
                    <BaseButton label="Publish" :loading="loading" type="submit" />
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<style lang="scss" scoped>
.camera {
    &.haze-bg {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100svh;
        padding-top: 1.75rem;
    }

    &__card {
        max-width: 41rem;
        width: 100%;
        box-shadow: 0 40px 80px rgb(0 0 0 / 70%);
        padding: 1.5rem 2rem;
        background-color: #141414;
        border: 1px solid rgb(255 255 255 / 5%);
        border-radius: 2rem;
    }

    &__wrapper {
        width: 100%;
    }

    &__frame {
        position: relative;
        aspect-ratio: 3 / 2;
        max-width: 35rem;
        width: 100%;
        box-shadow:
            0 1rem 2.5rem rgb(0 0 0 / 85%),
            0 0 0 0.125rem rgb(255 140 0 / 12%);
        background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
        margin: 0 auto;
        overflow: hidden;
        border: 2px solid rgb(255 154 60 / 12%);
        border-radius: 1.5rem;
    }

    &__shot {
        position: absolute;
        inset: 0;
        z-index: 1;
        object-fit: cover;
    }

    &__placeholder {
        display: grid;
        place-items: center;
        position: absolute;
        inset: 0;
        z-index: 0;
        background: linear-gradient(135deg, #f0a53e 0%, #f8bd2e 30%, #f06c4c 60%, #f04a46 100%);
        object-fit: cover;
        overflow: hidden;
        background-blend-mode: overlay;
    }

    &__placeholder-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.05rem;
        font-weight: 500;
        line-height: 1.45;
        letter-spacing: 0.025em;
        text-shadow:
            0 2px 8px rgb(0 0 0 / 20%),
            0 0 12px rgb(0 0 0 / 20%);
        color: #fff;
        margin-right: 1.5rem;
        font-style: italic;
    }

    &__placeholder-subtitle {
        margin-right: -1.5rem;
        font-size: 0.9rem;
        text-shadow: inherit;
        opacity: 0.92;
    }

    &__skeleton {
        height: 100%;
    }

    &__buttons {
        width: 100%;
        margin-top: 1rem;
    }

    &__buttons-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
    }

    &__capture-button {
        box-shadow: 0 0.25rem 0.6rem rgb(0 0 0 / 50%);
        background: linear-gradient(235deg, #ff9a3c, #ff6b3c, #f04a46);
        color: white;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;

        &:hover {
            transform: scale(1.05);
            filter: brightness(1.15);
        }

        &:active {
            transform: scale(0.95);
            filter: brightness(0.9);
        }
    }

    &__filepicker {
        align-items: center;
        max-width: 13.75rem;

        :deep() {
            .q-field__native {
                display: none;
            }

            .q-field__control::before,
            .q-field__control::after {
                display: none;
            }

            .q-field__control {
                min-height: auto;
                box-shadow: none;
                background: transparent;
                padding: 0;
            }
        }
    }

    &__filepicker-text {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        text-shadow: 0 0 0.375rem rgb(255 122 0 / 35%);
        color: #ff9a3c;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
            text-shadow: 0 0;
            color: #ffb15c;
        }
    }

    &__button-hover:hover {
        transform: scale(1.1);
    }

    &__link-text:hover {
        text-shadow: 0 0;
        color: #ffb15c;
    }

    &__input {
        :deep() {
            .q-field__control {
                background: rgb(255 255 255 / 2%);
                border-radius: 0.75rem;
            }

            .q-field__label {
                color: #aaa;
            }
        }
    }

    &__geo-button {
        width: 32px;
        height: 32px;
        margin-right: -4px;
        border-radius: 0.5rem;

        :deep(.q-icon) {
            font-size: 1.2rem;
            opacity: 0.8;
        }
    }

    &__field-control {
        background: #1b1b1b;
        border-radius: 0.875rem;
    }

    &__label {
        color: #ff9a3c;
    }

    &__field-border {
        border-color: rgb(255 154 60 / 30%);
    }

    &__textarea-scrollbar {
        scrollbar-color: rgb(255 154 60 / 45%) transparent;
        scrollbar-width: thin;
    }

    &__textarea-thumb {
        background: rgb(255 154 60 / 45%);
        border-radius: 62.4375rem;
    }

    &__textarea-thumb-hover:hover {
        background: rgb(255 154 60 / 70%);
    }

    &__post-button {
        font-weight: 700;
        letter-spacing: 0.0625rem;
        background: linear-gradient(90deg, #ff7a00, #ff3c00, #000);
        color: white;
        transition: all 0.3s ease;
        text-transform: uppercase;
        border-radius: 62.4375rem;
    }

    @media (max-width: $breakpoint-sm-min) {
        &__placeholder-wrapper {
            font-size: 0.8rem;
        }

        &__placeholder-subtitle {
            font-size: 0.7rem;
        }

        &__geo-button {
            max-width: 2.5rem;
            min-width: 2.5rem;
            height: 2.5rem;
            font-size: 0.9rem;
        }
    }
}
</style>
