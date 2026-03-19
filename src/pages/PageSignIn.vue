<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue';
import type { QForm } from 'quasar';
import { useQuasar } from 'quasar';
import type { SignInPayload } from 'src/types/auth.types';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Common
const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false);

// Form
const signInForm = useTemplateRef<QForm>('signInForm'),
    formData = reactive({
        email: '',
        password: '',
    });

const handleSignIn = async () => {
    if (!signInForm.value) return;

    signInForm.value.resetValidation();

    const success = await signInForm.value.validate();

    if (!success) {
        $q.notify({
            type: 'negative',
            message: '',
        });
    }

    loading.value = true;

    try {
        const payload: SignInPayload = {
            email: formData.email,
            password: formData.password,
        };
        const response = await storeAuth.signIn(payload);

        if (response) {
            $q.notify({
                type: 'positive',
                message: 'Signed in successfully!',
                timeout: 3000,
                icon: 'mail',
            });

            if (route.query.next) {
                await router.push(route.query.next as string);
            } else {
                await router.push({ name: 'home' });
            }
        }
    } catch (error) {
        const message = handleError(error);

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing in',
        });
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryType = route.query.type || hashParams.get('type');

    if (queryType === 'signup' || queryType === 'email') {
        $q.notify({
            type: 'positive',
            message: 'Email confirmed, sign in to get started',
            timeout: 4500,
        });

        await router.replace({ hash: '' });
    }
});
</script>

<template>
    <LayoutAuth subtitle="Sign in to continue" title="Welcome Back">
        <template #form>
            <q-form ref="signInForm" class="signin-form" @submit.prevent="handleSignIn">
                <q-input
                    v-model="formData.email"
                    autocomplete="email"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Email"
                    outlined
                    :rules="[
                        (val) => !!val || 'Email is required',
                        (val, rules) => rules.email(val) || 'Please enter a valid email address',
                    ]"
                    type="email" />

                <q-input
                    v-model="formData.password"
                    autocomplete="current-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Password"
                    outlined
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'At least 6 characters',
                    ]"
                    type="password" />

                <q-btn class="auth-button" label="Sign In" :loading="loading" no-caps type="submit">
                    <template #loading>
                        <q-spinner />
                    </template>
                </q-btn>

                <div class="signin-form__footer q-mt-lg">
                    <q-btn
                        class="signin-form__footer-button"
                        flat
                        label="Forgot password?"
                        no-caps
                        :to="{ name: 'forgot-password' }" />
                </div>
            </q-form>
        </template>

        <template #footer>
            Don't have an account?
            <RouterLink class="auth-link" :to="{ name: 'sign-up' }">Sign up</RouterLink>
        </template>
    </LayoutAuth>
</template>

<style lang="scss" scoped>
.signin-form {
    &__footer {
        display: flex;
        justify-content: end;
    }

    &__footer-button {
        font-size: 0.75rem;
        color: #ff9500;
    }
}
</style>
