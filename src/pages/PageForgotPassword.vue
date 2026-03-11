<script setup lang="ts">
import { ref } from 'vue'
import LayoutAuth from 'layouts/LayoutAuth.vue'
import { useStoreAuth } from 'stores/auth.store'
import { useQuasar } from 'quasar'
import type { RequestPasswordResetPayload } from 'src/types/auth.types'
import handleError from 'src/utils/handleError.utils'

const $q = useQuasar(),
    storeAuth = useStoreAuth(),
    email = ref(''),
    redirectTo = `${window.location.origin}/auth/reset-password`

// Timer
const seconds = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
    seconds.value = 10

    timer = setInterval(() => {
        if (seconds.value > 0) {
            seconds.value--
        } else {
            clearInterval(timer!)
            timer = null
        }
    }, 1000)
}

// Password reset
const handleRequestPasswordReset = async () => {
    const payload: RequestPasswordResetPayload = {
        email: email.value,
        redirectTo,
    }

    try {
        await storeAuth.requestPasswordReset(payload)

        $q.notify({
            type: 'positive',
            message: 'Reset link sent. If the email exists, you will receive it shortly',
        })

        startTimer()
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message,
        })
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Forgot Password" subtitle="Enter your email to receive a reset link">
            <template #form>
                <q-form class="q-gutter-y-md" @submit.prevent="handleRequestPasswordReset">
                    <q-input
                        v-model="email"
                        label="Email"
                        type="email"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
                        autocomplete="email"
                    />

                    <q-btn
                        type="submit"
                        :disable="seconds > 0"
                        :label="`${seconds > 0 ? `Resend in ${seconds}` : 'Send Reset Link'}`"
                        class="auth-button full-width q-mt-md"
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
