import { defineStore } from 'pinia'
import type { PostPayload, PostApi } from 'src/types/post.types'
import { getCurrentUser } from 'src/api/auth'
import { supabase } from 'src/api/supabaseClient'

export const useStorePosts = defineStore('storePosts', () => {
    const publishPost = async (draftPost: PostPayload) => {
        if (!draftPost.photoFile) throw new Error('File not found')

        // Get user session
        const user = await getCurrentUser()

        // Upload to 'posts' bucket
        const { data: storageData, error: storageError } = await supabase.storage
            .from('post-media')
            .upload(draftPost.uniqueFileName, draftPost.photoFile, {
                upsert: false,
            })

        if (storageError) throw storageError

        // Get image url
        const {
            data: { publicUrl },
        } = supabase.storage.from('post-media').getPublicUrl(storageData?.path)

        // Insert post
        const post = {
            user_id: user.id,
            caption: draftPost.caption,
            location: draftPost.location,
            image_url: publicUrl,
            taken_at: draftPost.takenAt,
        }

        const { error: postError } = await supabase.from('posts').insert(post)

        if (postError) throw postError
    }

    // Fetch posts
    const loadPosts = async (): Promise<PostApi[]> => {
        const user = await getCurrentUser()

        const { data, error } = await supabase.from('posts').select('*').eq('user_id', user.id)

        if (error) throw error

        return data
    }

    return { publishPost, loadPosts }
})
