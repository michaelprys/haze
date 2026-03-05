<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const remember = ref(false)

const onSubmit = () => {
    console.log('Login:', {
        email: email.value,
        password: password.value,
        remember: remember.value,
    })
}
</script>

<template>
    <q-page class="auth-page flex flex-center">
        <div class="auth-container">
            <div class="auth-header text-center q-mb-xl">
                <div class="logo-glow q-mb-md">
                    <img
                        style="margin-top: 6px; margin-left: 2px"
                        src="/src/assets/logo.webp"
                        width="100"
                        height="100"
                    />
                </div>
                <div class="auth-title">Welcome Back</div>
                <div class="auth-subtitle">Sign in to continue</div>
            </div>

            <q-card class="auth-card" flat bordered>
                <q-card-section>
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

                        <q-input
                            v-model="password"
                            label="Password"
                            type="password"
                            outlined
                            dense
                            color="primary"
                            class="auth-input"
                        />

                        <div class="row items-center justify-between q-mt-sm">
                            <q-checkbox
                                v-model="remember"
                                label="Remember me"
                                color="primary"
                                dark
                            />

                            <q-btn flat label="Forgot?" class="forgot-btn" no-caps />
                        </div>

                        <q-btn
                            type="submit"
                            label="Sign In"
                            class="login-btn full-width q-mt-md"
                            no-caps
                        />
                    </q-form>
                </q-card-section>
            </q-card>

            <div class="bottom-text text-center q-mt-lg">
                Don't have an account?
                <span class="signup-link">Sign up</span>
            </div>
        </div>
    </q-page>
</template>

<style scoped lang="sass">
.auth-page
    min-height: 100vh
    background: radial-gradient(circle at top, #111 0%, #000 60%)

.auth-container
    width: 100%
    max-width: 26rem
    padding: 2rem

.auth-title
    font-size: 1.8rem
    font-weight: 700
    color: #ffffff

.auth-subtitle
    font-size: 0.9rem
    color: #777

.logo-glow
    display: inline-flex
    background: rgba(255, 149, 0, 0.1)
    border-radius: 20px
    box-shadow: 0 0 15px rgba(255, 149, 0, 0.4)

.auth-card
    width: 100%
    background-color: #121212
    border-radius: 20px
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6)

.auth-input :deep(.q-field__control)
    background: rgba(255, 255, 255, 0.02)
    border-radius: 12px

.auth-input :deep(.q-field__label)
    color: #aaa

.login-btn
    height: 44px
    border-radius: 12px
    font-weight: 600
    letter-spacing: 0.5px
    background: linear-gradient(135deg, #ff9500, #ff3a00)
    box-shadow: 0 8px 20px rgba(255, 80, 0, 0.35)
    transition: all 0.25s ease

.login-btn:hover
    box-shadow: 0 12px 28px rgba(255, 80, 0, 0.5)

.forgot-btn
    color: #ff9500
    font-size: 0.75rem

.signup-link
    color: #ff6d00
    font-weight: 600
    cursor: pointer
    margin-left: 4px
    transition: 0.2s

.signup-link:hover
    color: #ff3a00

.bottom-text
    color: #777
    font-size: 0.85rem
</style>
