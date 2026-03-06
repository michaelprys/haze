import { defineStore } from 'pinia'
import { supabase } from 'src/utils/supabaseClient'
import type { PostPayload } from 'src/types/post'

export const useStorePosts = defineStore('storePosts', () => {
    const publishPost = async (draftPost: PostPayload) => {
        if (!draftPost.photoFile) throw new Error('File not found')

        // Get user session
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        // Upload to bucket
        const { data: storageData, error: storageError } = await supabase.storage
            .from('post-media')
            .upload(draftPost.uniqueFileName, draftPost.photoFile, {
                upsert: false,
            })

        if (storageError) throw storageError

        // Get image url
        const {
            data: { publicUrl },
        } = supabase.storage.from('post-media').getPublicUrl(storageData.path)

        const post = {
            user_id: user.id,
            caption: draftPost.caption,
            location: draftPost.location,
            image_url: publicUrl,
            taken_at: draftPost.takenAt,
        }

        // Insert post
        const { error: postError } = await supabase.from('posts').insert(post)

        if (postError) throw postError
    }

    return { publishPost }
})
