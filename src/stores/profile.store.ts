import { defineStore } from 'pinia'
import type { ProfileInfo } from 'src/types/profileInfo.types'
import { ref } from 'vue'
import { getCurrentUser } from 'src/api/auth'
import { supabase } from 'src/api/supabaseClient'

export const useStoreProfile = defineStore(
    'storeProfile',
    () => {
        const profileInfo = ref<ProfileInfo>()

        const updateAvatar = async (file: File) => {
            const user = await getCurrentUser()

            if (!file.type.startsWith('image/')) {
                throw new Error('Only images allowed')
            }

            if (file.size > 3 * 1024 * 1024) {
                throw new Error('File too large (max 3MB)')
            }

            if (!user) {
                throw new Error('Not authorized')
            }

            const path = `${user.id}/avatar`

            const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
                upsert: true,
                contentType: file.type || 'image/jpeg',
                cacheControl: '3600',
            })

            if (uploadError) {
                throw uploadError
            }

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)

            let publicUrl = urlData.publicUrl
            publicUrl += `?v=${Date.now()}`

            const { error: profileError } = await supabase.from('profiles').upsert(
                {
                    user_id: user.id,
                    avatar_url: publicUrl,
                },
                { onConflict: 'user_id' },
            )

            if (profileError) throw profileError

            if (profileInfo.value) {
                profileInfo.value.avatarUrl = publicUrl
            }

            return publicUrl
        }

        const loadUserInfo = async () => {
            const user = await getCurrentUser()
            if (!user) throw new Error('Not authorized')

            const { data, error } = await supabase
                .from('profiles')
                .select('username, bio, avatar_url')
                .eq('user_id', user.id)
                .single()

            if (error) throw error

            profileInfo.value = {
                username: data.username,
                bio: data.bio,
                avatarUrl: data.avatar_url || null,
            }
        }

        return { profileInfo, updateAvatar, loadUserInfo }
    },
    { persist: {} },
)
