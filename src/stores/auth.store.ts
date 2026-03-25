import type { User } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { supabase } from 'src/api/supabase.api';
import type { SignInPayload, SignUpPayload } from 'src/types/auth.types';
import { computed, ref } from 'vue';

export const useStoreAuth = defineStore('storeAuth', () => {
    const currentUser = ref<User | null>(null);
    const isLoggedIn = computed(() => Boolean(currentUser.value));
    const redirectTo = import.meta.env.VITE_APP_URL;
    const isAuthChecked = ref(false);

    const syncUser = (userData: User | null) => {
        currentUser.value = userData;
        isAuthChecked.value = true;
    };

    const checkAuth = async () => {
        if (isAuthChecked.value) return;

        try {
            const { data } = await supabase.auth.getUser();
            syncUser(data.user ?? null);
        } catch (error) {
            console.error(error);
            syncUser(null);
        }
    };

    supabase.auth.onAuthStateChange((_, session) => {
        syncUser(session?.user ?? null);
    });

    const signUp = async (payload: SignUpPayload) => {
        const { email, username, password } = payload;
        if (!email) throw new Error('Email required');

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username ?? null,
                },
                emailRedirectTo: `${redirectTo}/auth/sign-in`,
            },
        });
        if (signUpError) throw new Error(signUpError.message);

        return signUpData;
    };

    const signIn = async (payload: SignInPayload) => {
        const { email, password } = payload;
        if (!email) throw new Error('Email required');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        syncUser(data.user);

        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        syncUser(null);
    };

    const requestPasswordReset = async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${redirectTo}/auth/reset-password`,
        });

        if (error) throw error;

        return data;
    };

    const resetPassword = async (password: string, token: string) => {
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token,
        });
        if (sessionError) throw sessionError;

        const { error: updateUserError } = await supabase.auth.updateUser({
            password,
        });
        if (updateUserError) throw updateUserError;
    };

    const signInAsGuest = async () => {
        const { error } = await supabase.auth.signInAnonymously();

        if (error) throw error;
    };

    return {
        isLoggedIn,
        currentUser,
        isAuthChecked,
        checkAuth,
        signUp,
        signIn,
        signInAsGuest,
        signOut,
        requestPasswordReset,
        resetPassword,
    };
});
