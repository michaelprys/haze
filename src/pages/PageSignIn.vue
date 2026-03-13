<script setup lang="ts">
import { useStoreAuth } from 'stores/auth.store'
import LayoutAuth from 'layouts/LayoutAuth.vue'
import type { SignInPayload } from 'src/types/auth.types'
import { useQuasar } from 'quasar'
import { useTemplateRef, reactive, onMounted, ref } from 'vue'
import type { QForm } from 'quasar'
import handleError from 'src/utils/handleError.utils'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

// Common
const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false)

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

    loading.value = true

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

            if (route.query.next) {
                await router.push(route.query.next as string)
            } else {
                await router.push({ name: 'home' })
            }
        }
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error signing in',
        })
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const queryType = route.query.type || hashParams.get('type')

    if (queryType === 'signup' || queryType === 'email') {
        $q.notify({
            type: 'positive',
            message: 'Email confirmed, sign in to get started',
            timeout: 4500,
        })

        await router.replace({ hash: '' })
    }
})
</script>

<template>
    <LayoutAuth title="Welcome Back" subtitle="Sign in to continue">
        <template #form>
            <q-form ref="signInForm" @submit.prevent="handleSignIn">
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
                    v-model="formData.password"
                    label="Password"
                    type="password"
                    outlined
                    dense
                    color="primary"
                    autocomplete="current-password"
                    class="auth-input"
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'At least 6 characters',
                    ]"
                />

                <q-btn :loading="loading" class="auth-button full-width" type="submit" label="Sign In" no-caps>
                    <template #loading>
                        <q-spinner />
                    </template>
                </q-btn>

                <div class="row items-center justify-end q-mt-lg">
                    <q-btn class="forgot-btn" :to="{ name: 'forgot-password' }" flat label="Forgot password?" no-caps />
                </div>
            </q-form>
        </template>

        <template #footer>
            Don't have an account?
            <RouterLink class="auth-link" :to="{ name: 'sign-up' }">Sign up</RouterLink>
        </template>
    </LayoutAuth>
</template>

<style lang="sass" scoped>
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
