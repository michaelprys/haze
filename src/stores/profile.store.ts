import { defineStore } from 'pinia'
import { supabase } from 'src/api/supabaseClient'
import type { ProfileInfo } from 'src/types/profileInfo.types'
import { ref } from 'vue'
import { getCurrentUser } from 'src/api/auth'

export const useStoreProfile = defineStore(
    'storeProfile',
    () => {
        const profileInfo = ref<ProfileInfo>()

        const updateAvatar = async (avatar: ProfileInfo['avatar']) => {
            // Get user session
            const user = await getCurrentUser()

            if (!avatar) throw new Error('ItemAvatar not found')

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

            if (avatarError) throw avatarError
        }

        const loadUserInfo = async () => {
            const user = await getCurrentUser()

            const { data, error } = await supabase
                .from('profiles')
                .select('username, bio, avatar_url')
                .eq('user_id', user.id)
                .single()

            if (error) throw error

            profileInfo.value = {
                username: data.username,
                bio: data.bio,
                avatarUrl: data.avatar_url,
            }
        }

        return { profileInfo, updateAvatar, loadUserInfo }
    },
    { persist: {} },
)
