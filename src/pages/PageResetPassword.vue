<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue'
import { reactive, ref } from 'vue'
import { useStoreAuth } from 'stores/auth.store'
import handleError from 'src/utils/handleError.utils'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false)

// Form
const formData = reactive({
    newPassword: '',
    confirmNewPassword: '',
})

const handleResetPassword = async () => {
    loading.value = true

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
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="auth-container">
        <LayoutAuth title="Reset Password" subtitle="Set your new password">
            <template #form>
                <q-form @submit.prevent="handleResetPassword">
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
                        class="auth-button full-width q-mt-md"
                        type="submit"
                        label="Reset Password"
                        no-caps
                        :loading="loading"
                    >
                        <template #loading>
                            <q-spinner />
                        </template>
                    </q-btn>
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
