import type { Post, PostPayload } from 'src/types/post.types';
import type { Database } from 'app/database.types';
import { getCurrentUser } from 'src/api/auth.api';
import { supabase } from 'src/api/supabase.api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type PostRow = Database['public']['Tables']['posts']['Row'];

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
    const PAGE_SIZE = 2,
        offset = ref(0),
        hasMore = ref(false);

    const mapPostRowToPost = (p: PostRow): Post => ({
        id: p.id,
        caption: p.caption ?? '',
        location: p.location ?? '',
        photoFile: null,
        photoUrl: p.image_url,
        takenAt: p.taken_at,
    });

    const loadPosts = async (): Promise<void> => {
        const user = await getCurrentUser();

        const { data: postData, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user.id)
            .order('taken_at', { ascending: false })
            .range(0, PAGE_SIZE - 1);

        if (postError) throw postError;

        posts.value = (postData ?? []).map(mapPostRowToPost);

        offset.value = PAGE_SIZE;
        hasMore.value = (postData?.length ?? 0) === PAGE_SIZE;
    };

    // Load more posts
    const loadMore = async () => {
        if (!hasMore.value) return;

        const user = await getCurrentUser(),
            from = offset.value,
            to = from + PAGE_SIZE - 1;

        const { data: moreData, error: errorMorePosts } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user.id)
            .order('taken_at', { ascending: false })
            .range(from, to);

        if (errorMorePosts) throw errorMorePosts;

        if (!moreData?.length) {
            hasMore.value = false;

            return;
        }

        posts.value.push(...moreData.map(mapPostRowToPost));

        offset.value += moreData.length;

        if (moreData.length < PAGE_SIZE) {
            hasMore.value = false;
        }
    };

    // Extract file name
    const extractFileName = (url: string | null): string => {
        if (!url) return '';

        return url.split('/post-media/')[1] || '';
    };

    // Remove from Storage
    const deletePostImage = async (post: PostRow) => {
        const fileName = extractFileName(post?.image_url);

        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('post-media')
                .remove([fileName]);

            if (storageError) throw storageError;
        }
    };

    // Delete post
    const deletePost = async (postId: Post['id']) => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const response = supabase.from('posts');

        // Get image url
        const { data: post, error: fetchError } = await response
            .select('image_url')
            .eq('id', postId)
            .eq('user_id', user.id)
            .maybeSingle<PostRow>();

        if (fetchError) throw fetchError;
        if (!post?.image_url) return;

        // Delete post
        const { error: deleteError } = await response
            .delete()
            .eq('id', postId)
            .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        if (post) await deletePostImage(post);

        posts.value = posts.value.filter((post) => post.id !== postId);
    };

    return { posts, hasMore, publishPost, loadPosts, loadMore, deletePost };
});
