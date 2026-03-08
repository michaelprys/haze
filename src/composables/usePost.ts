import { ref } from 'vue'
import type { Post } from 'src/types/post.types'
import handleErrorUtils from 'src/utils/handleError.utils'
import { useRouter } from 'vue-router'
import { useStorePosts } from 'stores/posts.store'
import { useQuasar } from 'quasar'
import { generateFileName } from 'src/utils/generateFileName.utils'

export const usePost = () => {
    const router = useRouter(),
        storePosts = useStorePosts(),
        $q = useQuasar()

    const post = ref<Post>({
        id: '',
        caption: '',
        location: '',
        photoFile: null,
        takenAt: new Date().toISOString(),
    })

    const handlePublishPost = async (hasCameraSupport: boolean) => {
        if (!post.value.photoFile) {
            $q.notify({
                type: 'negative',
                message: `Please ${hasCameraSupport ? 'take a photo' : 'add an image'} before publishing`,
            })
            return
        }

        try {
            await storePosts.publishPost({
                ...post.value,
                photoFile: post.value.photoFile,
                uniqueFileName: generateFileName(post.value.photoFile),
            })

            $q.notify({
                type: 'positive',
                message: 'Image published',
            })

            post.value = {
                id: '',
                caption: '',
                location: '',
                photoFile: null,
                photoUrl: '',
                takenAt: new Date().toISOString(),
            }

            await router.push({ name: 'home' })
        } catch (error) {
            const message = handleErrorUtils(error)

            $q.notify({
                type: 'negative',
                message: message ?? 'Cannot publish image',
            })
        }
    }

    return {
        post,
        generateUniqueFileName: generateFileName,
        handlePublishPost,
    }
}
