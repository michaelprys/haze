<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue';
import { useQuasar } from 'quasar';
import type { RequestPasswordResetPayload } from 'src/types/auth.types';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { ref } from 'vue';

const $q = useQuasar(),
    storeAuth = useStoreAuth(),
    email = ref(''),
    redirectTo = `${window.location.origin}/auth/reset-password`,
    loading = ref(false);

// Timer
const seconds = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
    seconds.value = 10;

    timer = setInterval(() => {
        if (seconds.value > 0) {
            seconds.value--;
        } else {
            clearInterval(timer!);
            timer = null;
        }
    }, 1000);
};

// Password reset
const handleRequestPasswordReset = async () => {
    loading.value = true;

    const payload: RequestPasswordResetPayload = {
        email: email.value,
        redirectTo,
    };

    try {
        await storeAuth.requestPasswordReset(payload);

        $q.notify({
            type: 'positive',
            message:
                "Reset link sent! Check your inbox or spam. In this test mode, if the button isn't clickable, mark it as safe in your browser to continue",
        });

        startTimer();
    } catch (error) {
        const message = handleError(error);

        $q.notify({
            type: 'negative',
            message,
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <LayoutAuth subtitle="Enter your email to receive a reset link" title="Forgot Password">
        <template #form>
            <q-form @submit.prevent="handleRequestPasswordReset">
                <q-input
                    v-model="email"
                    autocomplete="email"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Email"
                    outlined
                    type="email"
                    :rules="[
                        (val) => !!val || 'Email is required',
                        (val, rules) => rules.email(val) || 'Please enter a valid email address',
                    ]"
                />

                <q-btn
                    class="auth-button"
                    :disable="seconds > 0"
                    :label="`${seconds > 0 ? `Resend in ${seconds}` : 'Send Reset Link'}`"
                    :loading="loading"
                    no-caps
                    type="submit"
                >
                    <template #loading>
                        <q-spinner />
                    </template>
                </q-btn>
            </q-form>
        </template>

        <template #footer>
            Already have an account?
            <RouterLink class="auth-link" :to="{ name: 'sign-in' }">Sign in</RouterLink>
        </template>
    </LayoutAuth>
</template>
