import handleError from 'src/utils/handleError.utils';
import type { Post } from 'src/types/post.types';
import type { Ref } from 'vue';
import { ref } from 'vue';

export const useCamera = (post: Ref<Post>) => {
    const hasCameraSupport = ref(true),
        isCameraInitializing = ref(true),
        isCameraActive = ref(false),
        imageCaptured = ref(false),
        imagePicked = ref(false),
        cameraModel = ref<File | null>(null),
        videoRef = ref<HTMLVideoElement | null>(null),
        canvasRef = ref<HTMLCanvasElement | null>(null);
    let cameraCooldown: ReturnType<typeof setTimeout> | undefined;

    const initCamera = async () => {
        isCameraInitializing.value = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.value) {
                videoRef.value.srcObject = stream;
            }

            hasCameraSupport.value = true;
            isCameraActive.value = true;
            imageCaptured.value = false;
        } catch (error) {
            console.error(handleError(error));

            hasCameraSupport.value = false;
            isCameraActive.value = false;
        } finally {
            isCameraInitializing.value = false;
        }
    };

    const deactivateCamera = () => {
        isCameraActive.value = false;

        if (videoRef.value) {
            videoRef.value.srcObject = null;
        }

        const stream = videoRef.value?.srcObject;

        if (!(stream instanceof MediaStream)) return;

        stream.getVideoTracks().forEach((track) => {
            track.stop();
        });
    };

    const resumeCamera = async () => {
        if (cameraCooldown) {
            clearTimeout(cameraCooldown);
            cameraCooldown = undefined;
        }

        if (!isCameraActive.value) {
            await initCamera();
        } else {
            imageCaptured.value = false;
        }
    };

    const captureImage = () => {
        const video = videoRef.value,
            canvas = canvasRef.value,
            context = canvas?.getContext('2d');

        if (!canvas || !video || !context) return;

        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURItoBlob = (dataURI: string): Blob => {
            const byteString = atob(dataURI.split(',')[1]!);
            const mime = dataURI.match(/:(.*?)/)?.[1] ?? 'application/octet-stream';

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ab], { type: mime });
        };

        imageCaptured.value = true;
        post.value.photoFile = dataURItoBlob(canvas.toDataURL());

        if (cameraCooldown) {
            clearTimeout(cameraCooldown);
        }

        cameraCooldown = setTimeout(() => {
            deactivateCamera();
            cameraCooldown = undefined;
        }, 30000);
    };

    const getImageSrc = (file: Post['photoFile']) => {
        if (!file) return null;
        post.value.photoUrl = URL.createObjectURL(file);
        post.value.photoFile = file;
        imagePicked.value = true;
    };

    const checkDevice = async () => {
        isCameraInitializing.value = true;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInput = devices.some((d) => d.kind === 'videoinput');

            hasCameraSupport.value = hasVideoInput;

            if (hasVideoInput) {
                await initCamera();
            } else {
                deactivateCamera();
            }
        } catch (error) {
            const message = handleError(error);
            console.error(message);
        } finally {
            isCameraInitializing.value = false;
        }
    };

    return {
        hasCameraSupport,
        isCameraInitializing,
        isCameraActive,
        imageCaptured,
        imagePicked,
        cameraModel,
        videoRef,
        canvasRef,
        initCamera,
        captureImage,
        deactivateCamera,
        resumeCamera,
        getImageSrc,
        checkDevice,
    };
};
