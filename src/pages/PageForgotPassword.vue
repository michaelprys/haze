<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from 'layouts/AuthLayout.vue'

const email = ref('')

const onSubmit = () => {
    console.log('Forgot Password:', {
        email: email.value,
    })
}
</script>

<template>
    <div class="auth-container">
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link">
            <template #form>
                <q-form class="q-gutter-y-md" @submit.prevent="onSubmit">
                    <q-input
                        v-model="email"
                        label="Email"
                        type="email"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
                    />

                    <q-btn
                        type="submit"
                        label="Send Reset Link"
                        class="auth-button full-width q-mt-md"
                        no-caps
                    />
                </q-form>
            </template>

            <template #footer>
                Already have an account?
                <RouterLink class="auth-link" :to="{ name: 'sign-in' }">Sign in</RouterLink>
            </template>
        </AuthLayout>
    </div>
</template>

<style scoped lang="sass">
.forgot-btn
    color: #ff9500
    font-size: 0.75rem


.auth-input
    :deep(.q-field__control)
        background: rgba(255, 255, 255, 0.02)
        border-radius: 12px

    :deep(.q-field__label)
        color: #aaa
</style>
