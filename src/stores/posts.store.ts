import { defineStore } from 'pinia'
import { supabase } from 'src/api/supabaseClient'
import type { PostPayload } from 'src/types/post.types'

export const useStorePosts = defineStore('storePosts', () => {
    const publishPost = async (draftPost: PostPayload) => {
        if (!draftPost.photoFile) throw new Error('File not found')

        // Get user session
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

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

    return { publishPost }
})
