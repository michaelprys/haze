import { defineStore } from 'pinia'
import { supabase } from 'src/utils/supabaseClient'
import type { SignUpPayload, SignInPayload } from 'src/types/auth'
import { computed, ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import handleError from 'src/utils/handleError'

export const useStoreAuth = defineStore('storeAuth', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = computed(() => !!user.value)

    supabase.auth
        .getUser()
        .then(({ data: authState }) => {
            user.value = authState.user ?? null
        })
        .catch((error) => {
            const message = handleError(error)
            console.error('Auth check failed: ', message)
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
                data: { username },
                emailRedirectTo: `${window.location.origin}/#/email-verification`,
            },
        })

        if (signUpError) throw signUpError

        return signUpData
    }

    const signIn = async (payload: SignInPayload) => {
        const { email, password } = payload

        if (!email) throw new Error('Email required')

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) throw signInError

        return signInData
    }

    const signOut = async () => {
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) throw signOutError
    }

    return {
        signUp,
        signIn,
        signOut,
        isAuthenticated,
    }
})
