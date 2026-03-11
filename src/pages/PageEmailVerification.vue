<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutAuth from 'layouts/LayoutAuth.vue'

// Common
const route = useRoute(),
    router = useRouter()

// Sign in
const status = computed(() => route.query.status as string),
    isSuccess = computed(() => status.value === 'success')

const goToSignIn = () => router.push({ name: 'sign-in' })
</script>

<template>
    <div class="auth-container">
        <LayoutAuth
            :title="isSuccess ? 'Email Confirmed' : 'Verification Failed'"
            :subtitle="
                isSuccess
                    ? 'Your email has been successfully verified'
                    : 'We could not verify your email link'
            "
        >
            <template #form>
                <div class="callback-content">
                    <div v-if="isSuccess" class="state success">
                        <q-icon name="check_circle" size="64px" color="positive" />
                        <p class="message">
                            Your account is now active. You can continue to sign in.
                        </p>
                        <q-btn
                            label="Go to Sign In"
                            class="auth-button full-width q-mt-md"
                            no-caps
                            @click="goToSignIn"
                        />
                    </div>

                    <div v-else class="state error">
                        <q-icon name="error" size="64px" color="negative" />
                        <p class="message">The verification link is invalid or has expired.</p>
                        <q-btn
                            label="Back to Sign In"
                            class="auth-button full-width q-mt-md"
                            no-caps
                            @click="goToSignIn"
                        />
                    </div>
                </div>
            </template>
        </LayoutAuth>
    </div>
</template>

<style lang="sass" scoped>
.callback-content
    display: flex
    flex-direction: column
    align-items: center
    text-align: center

.state
    display: flex
    flex-direction: column
    align-items: center

.message
    margin-top: 0.75rem
    font-size: 0.9rem
    color: #aaa
    max-width: 17.5rem

.success
    .message
        color: #9cffc7

.error
    .message
        color: #ffb3b3
</style>
