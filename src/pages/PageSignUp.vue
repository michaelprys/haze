<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from 'layouts/AuthLayout.vue'

const email = ref(''),
    password = ref(''),
    username = ref(''),
    confirmPassword = ref(''),
    remember = ref(false)

const onSubmit = () => {
    console.log('Login:', {
        email: email.value,
        password: password.value,
        remember: remember.value,
    })
}
</script>

<template>
    <div class="auth-container">
        <AuthLayout title="Create Account" subtitle="Sign up to get started">
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

                    <q-input
                        v-model="username"
                        label="Username"
                        type="text"
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

                    <q-input
                        v-model="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
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
        </AuthLayout>
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
