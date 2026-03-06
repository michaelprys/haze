import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Post } from 'src/types/post'

export const useCamera = (post: Ref<Post>) => {
    const hasCameraSupport = ref(true),
        imageCaptured = ref(false),
        imagePicked = ref(false),
        pickerModel = ref<File | null>(null),
        videoRef = ref<HTMLVideoElement | null>(null),
        canvasRef = ref<HTMLCanvasElement | null>(null)

    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            })

            if (videoRef.value) {
                videoRef.value.srcObject = stream
            }
        } catch (error) {
            console.error(error)
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
        const video = videoRef.value,
            canvas = canvasRef.value,
            context = canvas?.getContext('2d')

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
        post.value.photoFile = file
        imagePicked.value = true
    }

    return {
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
    }
}
