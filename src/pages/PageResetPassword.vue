<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue'
import { reactive } from 'vue'
import { useStoreAuth } from 'stores/storeAuth'
import handleError from 'src/utils/handleError'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth()

// Form
const formData = reactive({
    newPassword: '',
    confirmNewPassword: '',
})

const handleResetPassword = async () => {
    try {
        await storeAuth.resetPassword(formData.newPassword)

        $q.notify({
            type: 'positive',
            message: 'Password changed successfully',
        })

        await router.push({ name: 'sign-in' })
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error changing password',
        })
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Reset Password" subtitle="Set your new password">
            <template #form>
                <q-form class="q-gutter-y-md" @submit.prevent="handleResetPassword">
                    <q-input
                        v-model="formData.newPassword"
                        label="New Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        autocomplete="new-password"
                        class="auth-input"
                        :rules="[
                            (val) => !!val || 'Password is required',
                            (val) => val.length >= 6 || 'At least 6 characters',
                        ]"
                    />

                    <q-input
                        v-model="formData.confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        outlined
                        dense
                        color="primary"
                        class="auth-input"
                        autocomplete="new-password"
                        :rules="[
                            (val) => !!val || 'Password is required',
                            (val) => val === formData.newPassword || 'Passwords do not match',
                        ]"
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
        border-radius: 12px

    :deep(.q-field__label)
        color: #aaa
</style>
