<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue'

const resendVerification = () => {
    console.log('Resend verification email')
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth
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
        </LayoutAuth>
    </div>
</template>

<style scoped lang="sass"></style>
