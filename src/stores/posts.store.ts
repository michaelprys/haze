import { defineStore } from 'pinia';
import { getCurrentUser } from 'src/api/auth';
import { supabase } from 'src/api/supabaseClient';
import type { Post, PostApi, PostPayload } from 'src/types/post.types';
import { ref } from 'vue';

export const useStorePosts = defineStore('storePosts', () => {
    const posts = ref<Post[]>([]);

    // Publish post
    const publishPost = async (draftPost: PostPayload) => {
        if (!draftPost.photoFile) throw new Error('File not found');

        // Get user session
        const user = await getCurrentUser();

        // Upload to 'posts' bucket
        const { data: storageData, error: storageError } = await supabase.storage
            .from('post-media')
            .upload(draftPost.uniqueFileName, draftPost.photoFile, {
                upsert: false,
            });

        if (storageError) throw storageError;

        // Get image url
        const {
            data: { publicUrl },
        } = supabase.storage.from('post-media').getPublicUrl(storageData?.path);

        // Insert post
        const post = {
            user_id: user.id,
            caption: draftPost.caption,
            location: draftPost.location,
            image_url: publicUrl,
            taken_at: draftPost.takenAt,
        };

        const { error: postError } = await supabase.from('posts').insert(post);

        if (postError) throw postError;
    };

    // Fetch posts
    const loadPosts = async (): Promise<PostApi[]> => {
        const user = await getCurrentUser();

        const { data, error } = await supabase.from('posts').select('*').eq('user_id', user.id);

        if (error) throw error;

        posts.value = data.map((p) => ({
            id: p.id,
            caption: p.caption ?? '',
            location: p.location ?? '',
            photoFile: null,
            photoUrl: p.image_url,
            takenAt: p.taken_at,
        }));

        return data;
    };

    // Extract file name
    const extractFileName = (url: string | null): string => {
        if (!url) return '';

        return url.split('/post-media/')[1] || '';
    };

    // Delete post
    const deletePost = async (postId: Post['id']) => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const response = supabase.from('posts');

        // Get image url
        const { data: imageRow, error: fetchError } = await response
            .select('image_url')
            .eq('id', postId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!imageRow?.image_url) return;

        // Delete post
        const { error: deleteError } = await response
            .delete()
            .eq('id', postId)
            .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        posts.value = posts.value.filter((post) => post.id !== postId);

        // Remove from Storage
        const fileName = extractFileName(imageRow?.image_url);

        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('post-media')
                .remove([fileName]);

            if (storageError) throw storageError;
        }
    };

    return { posts, publishPost, loadPosts, deletePost };
});
