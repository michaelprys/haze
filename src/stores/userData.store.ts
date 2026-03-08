import { defineStore } from 'pinia'
import { supabase } from 'src/api/supabaseClient'
import type { UserData } from 'src/types/userData.types'
import { ref } from 'vue'
import { getCurrentUser } from 'src/api/auth'

export const useStoreProfile = defineStore(
    'storeProfile',
    () => {
        const currentAvatarUrl = ref<string>('')

        const updateAvatar = async (avatar: UserData['avatar']) => {
            // Get user session
            const user = await getCurrentUser()

            if (!avatar) throw new Error('Avatar not found')

            // Upload to 'profiles' bucket
            const ext = avatar.name.split('.').pop()?.toLowerCase() || 'jpg'
            const path = `${user.id}/avatar.${ext}`

            const { data: storageData, error: storageError } = await supabase.storage
                .from('avatars')
                .upload(path, avatar, {
                    upsert: true,
                })

            if (storageError) throw storageError

            // Get avatar url
            const {
                data: { publicUrl },
            } = supabase.storage.from('avatars').getPublicUrl(storageData.path)

            const { error: avatarError } = await supabase.from('profiles').upsert(
                {
                    user_id: user.id,
                    avatar_url: publicUrl,
                },
                { onConflict: 'user_id' },
            )

            currentAvatarUrl.value = publicUrl

            if (avatarError) throw avatarError
        }

        return { updateAvatar, currentAvatarUrl }
    },
    { persist: {} },
)
