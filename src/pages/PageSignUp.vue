<script setup lang="ts">
import { useTemplateRef, reactive, ref } from 'vue';
import LayoutAuth from 'layouts/LayoutAuth.vue';
import { useStoreAuth } from 'stores/auth.store';
import { useQuasar } from 'quasar';
import handleError from 'src/utils/handleError.utils';
import { useRouter } from 'vue-router';
import type { SignUpPayload } from 'src/types/auth.types';
import type { QForm } from 'quasar';

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false);

// Form
const signUpForm = useTemplateRef<QForm>('signUpForm'),
    formData = reactive({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
    });

const handleSignUp = async () => {
    if (!signUpForm.value) return;

    signUpForm.value.resetValidation();

    const success = await signUpForm.value.validate();

    loading.value = true;

    if (!success) {
        $q.notify({
            type: 'negative',
            message: 'Please fill out the form correctly',
        });
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        $q.notify({
            type: 'positive',
            message: "Passwords don't match",
        });
        return;
    }

    try {
        const payload: SignUpPayload = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
        };

        await storeAuth.signUp(payload);

        $q.notify({
            type: 'positive',
            message: 'Signed up successfully! Plёease check your inbox and confirm email',
            timeout: 6000,
            icon: 'mail',
        });

        await router.push({ name: 'sign-in' });
    } catch (error) {
        const message = handleError(error);

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing up',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <LayoutAuth subtitle="Sign up to get started" title="Create Account">
        <template #form>
            <q-form ref="signUpForm" @submit.prevent="handleSignUp">
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
                    type="email"
                />

                <q-input
                    v-model="formData.username"
                    autocomplete="off"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Username"
                    outlined
                    :rules="[
                        (val) => !!val || 'Username is required',
                        (val) => (val && val.length >= 3) || 'Minimum 3 characters',
                        (val) => (val && val.length <= 20) || 'Maximum 20 characters',
                        (val) =>
                            /^[a-zA-Z0-9_]+$/.test(val) ||
                            'Only letters, numbers and underscore allowed',
                    ]"
                    type="text"
                />

                <q-input
                    v-model="formData.password"
                    autocomplete="new-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Password"
                    outlined
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'At least 6 characters',
                    ]"
                    type="password"
                />

                <q-input
                    v-model="formData.confirmPassword"
                    autocomplete="new-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Confirm Password"
                    outlined
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val === formData.password || 'Passwords do not match',
                    ]"
                    type="password"
                />

                <q-btn class="auth-button" label="Sign Up" :loading="loading" no-caps type="submit">
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
