import { defineStore } from 'pinia'
import { supabase } from 'src/utils/supabaseClient'
import type { SignUpPayload } from 'src/types/auth'

export const useStoreAuth = defineStore('storeAuth', () => {
    const signUp = async (payload: SignUpPayload) => {
        const { email, username, password } = payload

        if (!email) throw new Error('Email required')

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        })

        if (signUpError) throw signUpError

        return signUpData
    }

    return {
        signUp,
    }
})
