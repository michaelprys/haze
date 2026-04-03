<script setup lang="ts">
import { useGeolocation } from 'src/composables/useGeolocation';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BaseButton from 'components/base/BaseButton.vue';
import { useCamera } from 'src/composables/useCamera';
import { usePost } from 'src/composables/usePost';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import type { QForm } from 'quasar';

const { post, loading, handlePublishPost } = usePost();

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

const formRef = ref<QForm | null | undefined>(null);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const isEditing = ref(false);
const originalImage = ref<string | null>(null);

watch(imageCaptured, (newVal) => {
    if (newVal && post.value.photoUrl) {
        originalImage.value = post.value.photoUrl;
    }
});

watch(
    () => post.value.photoUrl,
    (newUrl) => {
        if (newUrl && !newUrl.startsWith('data:image/jpeg;base64') && !imageCaptured.value) {
            originalImage.value = newUrl;
        }
    },
);

const applyCrop = () => {
    const cropper = cropperRef.value;
    if (cropper) {
        const { canvas } = cropper.getResult();
        if (canvas) {
            post.value.photoUrl = canvas.toDataURL('image/jpeg', 0.9);
        }
    }
    isEditing.value = false;
};

const resetSize = () => {
    if (originalImage.value) {
        post.value.photoUrl = originalImage.value;
    }
    isEditing.value = false;
};

const onPublish = async () => {
    if (post.value.photoUrl) {
        const response = await fetch(post.value.photoUrl);
        const blob = await response.blob();
        post.value.photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    }
    await handlePublishPost(hasCameraSupport.value, formRef.value);
};

const onDeviceChange = () => {
    isCameraInitializing.value = true;
    deactivateCamera();
    void checkDevice().finally(() => (isCameraInitializing.value = false));
};

const handleDeviceChange = () => {
    void onDeviceChange();
};

const { locationPending, hasGeolocation, getLocation } = useGeolocation(post);

onMounted(() => {
    void initCamera();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
});

onBeforeUnmount(() => {
    if (!loading.value) {
        post.value = {
            id: '',
            caption: '',
            location: '',
            photoFile: null,
            photoUrl: '',
            takenAt: new Date().toISOString(),
        };
    }
    navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    if (hasCameraSupport.value) {
        deactivateCamera();
    }
});
</script>

<template>
    <q-page class="camera haze-bg q-pa-md relative">
        <q-card class="camera__card q-pa-lg">
            <q-form @submit.prevent="onPublish" class="camera__wrapper" ref="formRef">
                <div class="camera__frame">
                    <q-skeleton
                        v-if="isCameraInitializing"
                        animation="none"
                        class="camera__skeleton" />

                    <video
                        v-show="isCameraActive && !imageCaptured"
                        ref="videoRef"
                        class="camera__shot camera__shot--video"
                        autoplay
                        playsinline />

                    <cropper
                        v-if="isEditing && originalImage"
                        ref="cropperRef"
                        class="camera__shot camera__cropper"
                        :src="originalImage"
                        :stencil-props="{ aspectRatio: 3 / 2 }"
                        image-restriction="none"
                        :transition="false" />

                    <q-img
                        v-if="!isEditing && post.photoUrl"
                        class="camera__shot camera__shot--static"
                        fit="cover"
                        no-transition
                        no-spinner
                        :transition-show="null"
                        :transition-hide="null"
                        :src="post.photoUrl" />

                    <canvas ref="canvasRef" v-show="false" />

                    <div v-if="post.photoUrl && !isCameraInitializing" class="camera__edit-layer">
                        <div v-if="!isEditing" class="camera__edit-controls">
                            <q-btn
                                class="camera__action-btn"
                                icon="aspect_ratio"
                                round
                                unelevated
                                @click="isEditing = true">
                                <q-tooltip>Edit Size</q-tooltip>
                            </q-btn>
                            <q-btn
                                v-if="hasCameraSupport"
                                class="camera__action-btn"
                                icon="replay"
                                round
                                unelevated
                                @click="resumeCamera">
                                <q-tooltip>Retake</q-tooltip>
                            </q-btn>
                        </div>
                        <div v-else class="camera__edit-controls camera__edit-controls--active">
                            <q-btn
                                class="camera__action-btn camera__action-btn--apply"
                                icon="check"
                                round
                                unelevated
                                @click="applyCrop" />
                            <q-btn
                                class="camera__action-btn camera__action-btn--reset"
                                icon="restart_alt"
                                round
                                unelevated
                                @click="resetSize" />
                        </div>
                    </div>

                    <div
                        v-show="!isCameraActive && !post.photoUrl && !imageCaptured"
                        class="camera__placeholder">
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
                    <div class="camera__buttons-wrapper">
                        <q-btn
                            v-if="hasCameraSupport && !post.photoUrl"
                            class="camera__capture-button q-mr-lg"
                            icon="camera_alt"
                            round
                            size="lg"
                            unelevated
                            @click="captureImage" />

                        <q-file
                            v-model="cameraModel"
                            class="camera__filepicker"
                            dense
                            flat
                            @update:model-value="getImageSrc">
                            <template #default>
                                <div v-if="post.photoUrl" class="camera__filepicker-text">
                                    <q-icon name="restart_alt" size="xs" class="q-mr-sm" />
                                    <span>replace memory</span>
                                </div>
                                <span v-else class="camera__filepicker-text">+ add memory</span>
                            </template>
                        </q-file>
                    </div>
                </div>

                <q-input
                    v-model="post.caption"
                    class="camera__input q-mt-md"
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
                            flat
                            @click.stop.prevent="getLocation"
                            class="camera__geo-button"
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
        background: #000;
        margin: 0 auto;
        overflow: hidden;
        border: 2px solid rgb(255 154 60 / 12%);
        border-radius: 1.5rem;
    }

    &__shot {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: none !important;

        &--video {
            transform: scaleX(-1);
        }
    }

    &__cropper {
        display: block;
        width: 100%;
        height: 100%;
        transition: none !important;

        :deep(.vue-advanced-cropper__background),
        :deep(.vue-advanced-cropper__foreground) {
            background: #000;
            transition: none !important;
        }

        :deep(.vue-advanced-cropper__image-wrapper) {
            transition: none !important;
        }

        :deep(img) {
            filter: none !important;
            transition: none !important;
        }
    }

    &__edit-layer {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 10;
    }

    &__edit-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        &--active {
            flex-direction: row-reverse;
        }
    }

    &__action-btn {
        width: 38px;
        height: 38px;
        backdrop-filter: blur(8px);
        background: rgb(15 15 15 / 60%);
        color: rgb(255 255 255 / 85%);
        transition: none !important;
        border: 1px solid rgb(255 255 255 / 10%);

        &:hover {
            background: rgb(15 15 15 / 80%);
            color: $primary;
            border-color: rgba($primary, 0.5);
        }

        &--apply {
            color: $positive;
            border-color: rgba($positive, 0.4);
        }

        &--reset {
            color: $warning;
            border-color: rgba($warning, 0.4);
        }
    }

    :deep(.vue-advanced-cropper) {
        width: 100%;
        height: 100%;
        background: #000;
        transition: none !important;

        .vue-rectangle-stencil__border {
            border: 2px solid $primary;
        }
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
        margin-top: 0.5rem;
    }

    &__buttons-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 0.75rem;
        min-height: 48px;
    }

    &__capture-button {
        box-shadow: 0 0.25rem 0.6rem rgb(0 0 0 / 50%);
        background: linear-gradient(235deg, #ff9a3c, #ff6b3c, #f04a46);
        color: white;

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
        width: fit-content;

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
        white-space: nowrap;
        text-shadow: 0 0 0.375rem rgb(255 122 0 / 35%);
        color: #ff9a3c;
        cursor: pointer;

        &:hover {
            text-shadow: 0 0;
            color: #ffb15c;
        }
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
        transition: all 0.3s ease;

        &:hover {
            background: rgb(255 154 60 / 12%);
            color: $primary;
        }

        :deep(.q-icon) {
            font-size: 1.2rem;
            opacity: 0.8;
            transition: all 0.2s ease;
        }

        &:hover :deep(.q-icon) {
            transform: scale(1.1);
            opacity: 1;
        }
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

    @media (max-width: $breakpoint-xs) {
        &__placeholder-wrapper {
            font-size: 0.7rem;
        }

        &__placeholder-subtitle {
            font-size: 0.6rem;
        }
    }
}
</style>
