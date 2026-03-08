<script setup lang="ts">
import { useStoreAuth } from 'stores/auth.store'
import LayoutAuth from 'layouts/LayoutAuth.vue'
import type { SignInPayload } from 'src/types/auth.types'
import { useQuasar } from 'quasar'
import { useTemplateRef, reactive } from 'vue'
import type { QForm } from 'quasar'
import handleErrorUtils from 'src/utils/handleError.utils'
import { useRouter } from 'vue-router'

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth()

// Form
const signInForm = useTemplateRef<QForm>('signInForm'),
    formData = reactive({
        email: '',
        password: '',
    })

const handleSignIn = async () => {
    if (!signInForm.value) return

    signInForm.value.resetValidation()

    const success = await signInForm.value.validate()

    if (!success) {
        $q.notify({
            type: 'negative',
            message: '',
        })
    }

    try {
        const payload: SignInPayload = {
            email: formData.email,
            password: formData.password,
        }

        const response = await storeAuth.signIn(payload)

        if (response) {
            $q.notify({
                type: 'positive',
                message: 'Signed in successfully!',
                timeout: 3000,
                icon: 'mail',
            })
            await router.push({ name: 'home' })
        }
    } catch (error) {
        const message = handleErrorUtils(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing in',
        })
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Welcome Back" subtitle="Sign in to continue">
            <template #form>
                <q-form ref="signInForm" class="q-gutter-y-md" @submit.prevent="handleSignIn">
                    <q-input
                        v-model="formData.email"
                        label="Email"
                        type="email"
                        outlined
                        dense
                        color="primary"
                        autocomplete="email"
                        class="auth-input"
                    />

                    <q-input
                        v-model="formData.password"
                        label="Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        autocomplete="current-password"
                        class="auth-input"
                    />

                    <div class="row items-center justify-between q-mt-sm">
                        <q-checkbox
                            v-model="storeAuth.hasRememberMe"
                            label="Remember me"
                            color="primary"
                            dark
                        />

                        <q-btn
                            :to="{ name: 'forgot-password' }"
                            flat
                            label="Forgot?"
                            class="forgot-btn"
                            no-caps
                        />
                    </div>

                    <q-btn
                        type="submit"
                        label="Sign In"
                        class="auth-button full-width q-mt-md"
                        no-caps
                    />
                </q-form>
            </template>

            <template #footer>
                Don't have an account?
                <RouterLink class="auth-link" :to="{ name: 'sign-up' }">Sign up</RouterLink>
            </template>
        </LayoutAuth>
    </div>
</template>

<style scoped lang="sass">
.forgot-btn
    color: #ff9500
    font-size: 0.75rem

.auth-input
    :deep(.q-field__control)
        background: rgba(255, 255, 255, 0.02)
        border-radius: 0.75rem

    :deep(.q-field__label)
        color: #aaa
</style>
