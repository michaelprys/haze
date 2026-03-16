import { defineStore } from 'pinia';
import type { SignUpPayload, SignInPayload, RequestPasswordResetPayload } from 'src/types/auth.types';
import { computed, ref } from 'vue';
import type { User } from '@supabase/supabase-js';
import handleError from 'src/utils/handleError.utils';
import { supabase } from 'src/api/supabaseClient';

export const useStoreAuth = defineStore('storeAuth', () => {
  const user = ref<User | null>(null),
    isAuthenticated = computed(() => !!user.value);

  void (async () => {
    try {
      const { data: authState } = await supabase.auth.getUser();
      user.value = authState.user ?? null;
    } catch (error) {
      console.error(handleError(error));
      user.value = null;
    }
  })();

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null;
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

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    user.value = null;
  };

  const requestPasswordReset = async (payload: RequestPasswordResetPayload) => {
    const { email, redirectTo } = payload;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
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

  return {
    isAuthenticated,
    user,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
  };
});
