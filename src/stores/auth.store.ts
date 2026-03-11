import { defineStore } from 'pinia'
import { supabase } from 'src/api/supabaseClient'
import type {
    SignUpPayload,
    SignInPayload,
    RequestPasswordResetPayload,
} from 'src/types/auth.types'
import { computed, ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import handleError from 'src/utils/handleError.utils'

export const useStoreAuth = defineStore('storeAuth', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = computed(() => !!user.value)
    const hasRememberMe = ref(false)

    supabase.auth
        .getUser()
        .then(({ data: authState }) => {
            user.value = authState.user ?? null
        })
        .catch((error) => {
            const message = handleError(error)
            console.error('LayoutAuth check failed: ', message)
            user.value = null
        })

    supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null
    })

    const signUp = async (payload: SignUpPayload) => {
        const { email, username, password } = payload

        if (!email) throw new Error('Email required')

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username ?? null,
                },
            },
        })

        if (signUpError) throw new Error(signUpError.message)

        return signUpData
    }

    const signIn = async (payload: SignInPayload) => {
        const { email, password } = payload

        if (!email) throw new Error('Email required')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        console.log(isAuthenticated.value)

        return data
    }

    const signOut = async () => {
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) throw signOutError
    }

    const requestPasswordReset = async (payload: RequestPasswordResetPayload) => {
        const { email, redirectTo } = payload

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        })

        if (error) throw error

        return data
    }

    const resetPassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({
            password,
        })

        if (error) throw error
    }

    return {
        isAuthenticated,
        hasRememberMe,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        resetPassword,
    }
})
