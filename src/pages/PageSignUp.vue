<script setup lang="ts">
import { useTemplateRef, reactive } from 'vue'
import LayoutAuth from 'layouts/LayoutAuth.vue'
import { useStoreAuth } from 'stores/storeAuth'
import type { SignUpPayload } from 'src/types/auth'
import { useQuasar } from 'quasar'
import type { QForm } from 'quasar'
import handleError from 'src/utils/handleError'
import { useRouter } from 'vue-router'

const storeAuth = useStoreAuth()
const $q = useQuasar()
const signUpForm = useTemplateRef<QForm>('signUpForm')
const router = useRouter()

const formData = reactive({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
})

const handleSignUp = async () => {
    if (!signUpForm.value) return

    signUpForm.value.resetValidation()

    const success = await signUpForm.value.validate()

    if (!success) {
        $q.notify({
            type: 'negative',
            message: '',
        })
    }

    if (formData.password !== formData.confirmPassword) {
        $q.notify({
            type: 'positive',
            message: "Passwords don't match",
        })
    }

    await router.push({ name: 'sign-in' })

    try {
        const payload: SignUpPayload = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
        }

        const response = await storeAuth.signUp(payload)

        if (response) {
            $q.notify({
                type: 'positive',
                message: 'Signed up successfully! Please check your inbox and confirm email',
                timeout: 6000,
                icon: 'mail',
            })
        }
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing up',
        })
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Create Account" subtitle="Sign up to get started">
            <template #form>
                <q-form class="q-gutter-y-md" ref="signUpForm" @submit.prevent="handleSignUp">
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
                            (val, rules) =>
                                rules.email(val) || 'Please enter a valid email address',
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
                            (val) =>
                                /^[a-zA-Z0-9_]+$/.test(val) ||
                                'Only letters, numbers and underscore allowed',
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

                    <q-btn
                        class="auth-button full-width q-mt-md"
                        type="submit"
                        label="Sign Up"
                        no-caps
                    />
                </q-form>
            </template>

            <template #footer>
                Already have an account?
                <RouterLink class="auth-link" :to="{ name: 'sign-in' }">Sign in</RouterLink>
            </template>
        </LayoutAuth>
    </div>
</template>

<style scoped lang="sass">
.auth-input
    :deep(.q-field__control)
        background: rgba(255, 255, 255, 0.02)
        border-radius: 12px

    :deep(.q-field__label)
        color: #aaa
</style>
