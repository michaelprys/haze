import type { QForm } from 'quasar';
import { useQuasar } from 'quasar';
import type { Post } from 'src/types/post.types';
import { generateFileName } from 'src/utils/generateFileName.utils';
import handleError from 'src/utils/handleError.utils';
import { useStorePosts } from 'stores/posts.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const usePost = () => {
    const router = useRouter(),
        storePosts = useStorePosts(),
        $q = useQuasar(),
        loading = ref(false);

    const post = ref<Post>({
        id: '',
        caption: '',
        location: '',
        photoFile: null,
        takenAt: new Date().toISOString(),
    });

    const handlePublishPost = async (
        hasCameraSupport: boolean,
        formRef: QForm | null | undefined,
    ) => {
        if (!formRef) return;

        const isValid = await formRef.validate();

        if (!isValid) {
            $q.notify({
                type: 'negative',
                message: 'Form validation failed',
            });
            return;
        }

        loading.value = true;

        if (!post.value.photoFile) {
            $q.notify({
                type: 'negative',
                message: `Please ${hasCameraSupport ? 'take a photo' : 'add an image'} before publishing`,
            });
            loading.value = false;
            return;
        }

        try {
            await storePosts.publishPost({
                ...post.value,
                photoFile: post.value.photoFile,
                uniqueFileName: generateFileName(post.value.photoFile),
            });

            $q.notify({
                type: 'positive',
                message: 'Image published',
            });

            await router.push({ name: 'home' });
        } catch (error) {
            const message = handleError(error);

            $q.notify({
                type: 'negative',
                message: message ?? 'Cannot publish image',
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        post,
        loading,
        generateUniqueFileName: generateFileName,
        handlePublishPost,
    };
};
