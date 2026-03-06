import { ref } from 'vue'
import type { Post } from 'src/types/post'
import handleError from 'src/utils/handleError'
import { useRouter } from 'vue-router'
import { useStorePosts } from 'stores/storePosts'
import { useQuasar } from 'quasar'
import { generateUniqueFileName } from 'src/utils/generateUniqueFileName'

export const usePost = () => {
    const router = useRouter(),
        storePosts = useStorePosts(),
        $q = useQuasar()

    const post = ref<Post>({
        caption: '',
        location: '',
        photoFile: null,
        takenAt: new Date().toISOString(),
    })

    const handlePublishPost = async (hasCameraSupport: boolean) => {
        if (!post.value.photoFile) {
            $q.notify({
                type: 'negative',
                message: `Please add a ${hasCameraSupport ? 'photo' : 'image'} before publishing`,
            })
            return
        }

        try {
            await storePosts.publishPost({
                ...post.value,
                photoFile: post.value.photoFile,
                uniqueFileName: generateUniqueFileName(post.value.photoFile),
            })

            $q.notify({
                type: 'positive',
                message: 'Image published',
            })

            post.value = {
                caption: '',
                location: '',
                photoFile: null,
                takenAt: new Date().toISOString(),
            }

            await router.push({ name: 'home' })
        } catch (error) {
            const message = handleError(error)

            $q.notify({
                type: 'negative',
                message: message ?? 'Cannot publish image',
            })
        }
    }

    return {
        post,
        generateUniqueFileName,
        handlePublishPost,
    }
}
