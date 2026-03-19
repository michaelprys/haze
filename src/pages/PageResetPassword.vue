<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue';
import { useQuasar } from 'quasar';
import { getRecoveryToken } from 'src/utils/getRecoveryToken.utils';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// Common
const router = useRouter(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false),
    tokenInUrl = getRecoveryToken();

// Form
const formData = reactive({
    newPassword: '',
    confirmNewPassword: '',
});

const handleResetPassword = async () => {
    if (!tokenInUrl) {
        $q.notify({
            type: 'negative',
            message: 'Recovery token missing. Please request a new reset link',
        });
        return;
    }

    loading.value = true;

    try {
        await storeAuth.resetPassword(formData.newPassword, tokenInUrl);

        $q.notify({
            type: 'positive',
            message: 'Password changed successfully',
        });

        await router.push({ name: 'sign-in' });
    } catch (error) {
        const message = handleError(error);

        $q.notify({
            type: 'negative',
            message: message ?? 'Error changing password',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <LayoutAuth subtitle="Set your new password" title="Reset Password">
        <template #form>
            <q-form @submit.prevent="handleResetPassword">
                <q-input
                    v-model="formData.newPassword"
                    autocomplete="new-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="New Password"
                    outlined
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'At least 6 characters',
                    ]"
                    type="password" />

                <q-input
                    v-model="formData.confirmNewPassword"
                    autocomplete="new-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Confirm New Password"
                    outlined
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val === formData.newPassword || 'Passwords do not match',
                    ]"
                    type="password" />

                <q-btn
                    class="auth-button"
                    label="Reset Password"
                    :loading="loading"
                    no-caps
                    type="submit">
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
</template>
