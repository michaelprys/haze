<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { uid } from 'quasar'
import type { Post } from 'src/types/post'
import type { Location } from 'src/types/location'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { delay } from 'src/utils/delay'

const post = ref<Post>({
    id: uid(),
    caption: '',
    location: '',
    photoFile: null,
    date: Date.now(),
})

const $q = useQuasar()
const hasCameraSupport = ref(true)
const imageCaptured = ref(false)
const imagePicked = ref(false)
const locationPending = ref(false)

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const pickerModel = ref<File | null>(null)

const hasGeolocation = computed(() => 'geolocation' in navigator)

const initCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        })

        if (videoRef.value) {
            videoRef.value.srcObject = stream
        }
    } catch (err) {
        console.error(err)
        hasCameraSupport.value = false
    }
}

const deactivateCamera = () => {
    const stream = videoRef.value?.srcObject

    if (!(stream instanceof MediaStream)) return

    stream.getVideoTracks().forEach((track) => {
        track.stop()
    })
}

const captureImage = () => {
    const video = videoRef.value
    const canvas = canvasRef.value
    const context = canvas?.getContext('2d')

    if (!canvas || !video || !context) return

    canvas.width = video.getBoundingClientRect().width
    canvas.height = video.getBoundingClientRect().height
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataURItoBlob = (dataURI: string): Blob => {
        const byteString = atob(dataURI.split(',')[1]!)
        const mime = dataURI.match(/:(.*?)/)?.[1] ?? 'application/octet-stream'

        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ab], { type: mime })
    }

    imageCaptured.value = true
    post.value.photoFile = dataURItoBlob(canvas.toDataURL())
    deactivateCamera()
}

const getImageSrc = (file: Post['photoFile']) => {
    if (!file) return null
    post.value.photoUrl = URL.createObjectURL(file)
    imagePicked.value = true
}

const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)

const getLocation = async () => {
    try {
        locationPending.value = true

        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 })
        })
        latitude.value = pos.coords.latitude
        longitude.value = pos.coords.longitude

        await getPreciseLocation(pos)
    } catch (err) {
        console.error('Geolocation not found: ', err)

        $q.notify({
            type: 'negative',
            message: 'Could not find the location',
        })
    } finally {
        await delay(500)
        locationPending.value = false
    }
}

const getPreciseLocation = async (pos: GeolocationPosition) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`

    try {
        const { data } = await api.get<Location>(url)

        post.value.location = `${data.address.city}, ${data.address.country}`
    } catch (err) {
        console.error(err)
    }
}

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
                    v-show="!imageCaptured && !imagePicked"
                    class="full-width"
                    ref="videoRef"
                    autoplay
                    playsinline
                />
                <canvas v-show="imageCaptured" class="full-width" height="240" ref="canvasRef" />

                <q-img v-show="imagePicked" :src="post.photoUrl" alt="Attached photo" />
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
                    />
                </template>
            </q-input>

            <div class="q-mt-xl">
                <q-btn label="Publish" class="post-btn full-width" unelevated size="md" />
            </div>
        </q-card>
    </q-page>
</template>

<style lang="sass">
.haze-bg
    //background: radial-gradient(circle at top, #1a1a1a, #0d0d0d 70%)
    min-height: 100vh
    display: flex
    justify-content: center
    align-items: flex-start
    padding-top: 1.75rem

.post-card
    //background: #111
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

.post-image
    width: 100%
    border-radius: 1rem
    max-height: 25rem

.camera-btn
    background: linear-gradient(135deg, rgba(255, 122, 0, 0.8), rgba(255, 60, 0, 0.8)) !important
    color: white
    //box-shadow: 0 0 1.5625rem rgba(255, 120, 0, 0.5)
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
