<script setup lang="ts">
import { useTemplateRef, reactive, ref } from 'vue'
import LayoutAuth from 'layouts/LayoutAuth.vue'
import { useStoreAuth } from 'stores/auth.store'
import { useQuasar } from 'quasar'
import handleError from 'src/utils/handleError.utils'
import { useRouter } from 'vue-router'
import type { SignUpPayload } from 'src/types/auth.types'
import type { QForm } from 'quasar'

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false)

// Form
const signUpForm = useTemplateRef<QForm>('signUpForm'),
    formData = reactive({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
    })

const handleSignUp = async () => {
    if (!signUpForm.value) return

    signUpForm.value.resetValidation()

    const success = await signUpForm.value.validate()

    loading.value = true

    if (!success) {
        $q.notify({
            type: 'negative',
            message: 'Please fill out the form correctly',
        })
        return
    }

    if (formData.password !== formData.confirmPassword) {
        $q.notify({
            type: 'positive',
            message: "Passwords don't match",
        })
        return
    }

    try {
        const payload: SignUpPayload = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
        }

        await storeAuth.signUp(payload)

        $q.notify({
            type: 'positive',
            message: 'Signed up successfully! Plёease check your inbox and confirm email',
            timeout: 6000,
            icon: 'mail',
        })

        await router.push({ name: 'sign-in' })
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing up',
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Create Account" subtitle="Sign up to get started">
            <template #form>
                <q-form ref="signUpForm" @submit.prevent="handleSignUp">
                    <q-input
                        v-model="formData.email"
                        label="Email"
                        type="email"
                        outlined
                        dense
                        color="primary"
                        autocomplete="email"
                        class="auth-input"
                        :rules="[
                            (val) => !!val || 'Email is required',
                            (val, rules) => rules.email(val) || 'Please enter a valid email address',
                        ]"
                    />

                    <q-input
                        v-model="formData.username"
                        label="Username"
                        type="text"
                        outlined
                        dense
                        color="primary"
                        autocomplete="off"
                        class="auth-input"
                        :rules="[
                            (val) => !!val || 'Username is required',
                            (val) => (val && val.length >= 3) || 'Minimum 3 characters',
                            (val) => (val && val.length <= 20) || 'Maximum 20 characters',
                            (val) => /^[a-zA-Z0-9_]+$/.test(val) || 'Only letters, numbers and underscore allowed',
                        ]"
                    />

                    <q-input
                        v-model="formData.password"
                        label="Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        autocomplete="new-password"
                        class="auth-input"
                        :rules="[
                            (val) => !!val || 'Password is required',
                            (val) => val.length >= 6 || 'At least 6 characters',
                        ]"
                    />

                    <q-input
                        v-model="formData.confirmPassword"
                        label="Confirm Password"
                        type="password"
                        outlined
                        dense
                        autocomplete="new-password"
                        color="primary"
                        class="auth-input"
                        :rules="[
                            (val) => !!val || 'Password is required',
                            (val) => val === formData.password || 'Passwords do not match',
                        ]"
                    />

                    <q-btn class="auth-button full-width" type="submit" label="Sign Up" no-caps :loading="loading">
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
    </div>
</template>

<style lang="sass" scoped>
.auth-input
    :deep(.q-field__control)
        background: rgba(255, 255, 255, 0.02)
        border-radius: 0.75rem

    :deep(.q-field__label)
        color: #aaa
</style>
