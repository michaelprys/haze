<script setup lang="ts">
import AuthLayout from 'layouts/AuthLayout.vue'
import { supabase } from 'src/utils/supabaseClient'
import { reactive } from 'vue'

const formData = reactive({
    newPassword: '',
    confirmNewPassword: '',
})

const changePassword = () => {}

await supabase.auth.getSession()
</script>

<template>
    <div class="auth-container">
        <AuthLayout title="Reset Password" subtitle="Set your new password">
            <template #form>
                <q-form class="q-gutter-y-md" @submit.prevent="changePassword">
                    <q-input
                        v-model="formData.newPassword"
                        label="New Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
                    />

                    <q-input
                        v-model="formData.confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
                    />

                    <q-btn
                        type="submit"
                        label="Reset Password"
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
