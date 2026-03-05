<script setup lang="ts">
import AuthLayout from 'layouts/AuthLayout.vue'

const resendVerification = () => {
    console.log('Resend verification email')
}
</script>

<template>
    <div class="auth-container">
        <AuthLayout
            title="Verify Email"
            subtitle="Please check your inbox and verify your email address"
        >
            <template #form>
                <div class="text-center q-gutter-y-md">
                    <q-btn
                        label="Resend Verification Email"
                        class="auth-button full-width"
                        no-caps
                        @click="resendVerification"
                    />
                </div>
            </template>

            <template #footer>
                Already verified?
                <RouterLink class="auth-link" :to="{ name: 'sign-in' }"> Sign in </RouterLink>
            </template>
        </AuthLayout>
    </div>
</template>

<style scoped lang="sass"></style>
