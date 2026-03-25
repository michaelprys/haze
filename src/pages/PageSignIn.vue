<script setup lang="ts">
import LayoutAuth from 'layouts/LayoutAuth.vue';
import type { QForm } from 'quasar';
import { useQuasar } from 'quasar';
import type { SignInPayload } from 'src/types/auth.types';
import handleError from 'src/utils/handleError.utils';
import { useStoreAuth } from 'stores/auth.store';
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter(),
    route = useRoute(),
    $q = useQuasar(),
    storeAuth = useStoreAuth(),
    loading = ref(false),
    guestLoading = ref(false),
    isPasswordVisible = ref(false);

const signInForm = useTemplateRef<QForm>('signInForm'),
    formData = reactive({
        email: '',
        password: '',
    });

const handleSignIn = async (isGuest = false) => {
    if (!isGuest && !signInForm.value) return;

    if (!isGuest) {
        signInForm.value?.resetValidation();
        const success = await signInForm.value?.validate();
        if (!success) return;
    }

    const targetLoading = isGuest ? guestLoading : loading;
    targetLoading.value = true;

    try {
        if (isGuest) {
            await storeAuth.signInAsGuest();
        } else {
            const payload: SignInPayload = {
                email: formData.email,
                password: formData.password,
            };
            await storeAuth.signIn(payload);
        }

        $q.notify({
            type: 'positive',
            message: isGuest ? 'Welcome! Entering guest mode...' : 'Signed in successfully!',
            timeout: 3000,
        });

        if (route.query.next) {
            await router.push(route.query.next as string);
        } else {
            await router.push({ name: 'home' });
        }
    } catch (error) {
        const message = handleError(error);
        $q.notify({ type: 'negative', message: message ?? 'Error signing in' });
    } finally {
        targetLoading.value = false;
    }
};

onMounted(async () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryType = route.query.type || hashParams.get('type');

    if (queryType === 'signup' || queryType === 'email') {
        $q.notify({
            type: 'positive',
            message: 'Email confirmed, sign in to get started',
            timeout: 4500,
        });
        await router.replace({ hash: '' });
    }
});
</script>

<template>
    <LayoutAuth subtitle="Sign in or try the demo" title="Get started">
        <template #form>
            <q-form ref="signInForm" class="signin-form" @submit.prevent="handleSignIn(false)">
                <q-input
                    v-model="formData.email"
                    autocomplete="email"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Email"
                    outlined
                    :rules="[
                        (val) => !!val || 'Email is required',
                        (val, rules) => rules.email(val) || 'Please enter a valid email address',
                    ]"
                    type="email" />

                <q-input
                    v-model="formData.password"
                    autocomplete="current-password"
                    class="auth-input"
                    color="primary"
                    dense
                    label="Password"
                    outlined
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'At least 6 characters',
                    ]">
                    <template #append>
                        <q-icon
                            :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPasswordVisible = !isPasswordVisible" />
                    </template>
                </q-input>

                <q-btn
                    class="auth-button q-mt-md"
                    label="Sign In"
                    :loading="loading"
                    no-caps
                    type="submit"
                    unelevated>
                    <template #loading>
                        <q-spinner />
                    </template>
                </q-btn>

                <div class="auth-divider">
                    <span>Explore the app</span>
                </div>

                <q-btn
                    class="guest-button"
                    :loading="guestLoading"
                    no-caps
                    unelevated
                    @click="handleSignIn(true)">
                    <div class="guest-button__content">
                        <q-icon class="guest-button__icon" name="photo_camera" />
                        <span class="guest-button__text">Try Guest Demo</span>
                    </div>
                    <div class="guest-button__bg"></div>
                    <div class="guest-button__flare"></div>
                    <div class="guest-button__glow-ring"></div>
                </q-btn>

                <div class="signin-form__footer q-mt-lg">
                    <q-btn
                        class="signin-form__footer-button"
                        flat
                        label="Forgot password?"
                        no-caps
                        :to="{ name: 'forgot-password' }" />
                </div>
            </q-form>
        </template>

        <template #footer>
            Don't have an account?
            <RouterLink class="auth-link" :to="{ name: 'sign-up' }">Sign up</RouterLink>
        </template>
    </LayoutAuth>
</template>

<style lang="scss" scoped>
.signin-form {
    --accent-color: #a29bfe;
    --secondary-color: #74b9ff;
    --glow-color: rgba(162, 155, 254, 0.5);
    --divider-color: rgba(255, 255, 255, 0.08);

    &__footer {
        display: flex;
        justify-content: flex-end;

        &-button {
            font-size: 0.75rem;
            color: var(--accent-color);
            opacity: 0.7;
            transition: opacity 0.3s;
            &:hover {
                opacity: 1;
            }
        }
    }
}

.auth-divider {
    display: flex;
    align-items: center;
    margin: 2rem 0 1.5rem;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-family: 'Space Grotesk', sans-serif;

    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--divider-color);
    }

    span {
        padding: 0 1.25rem;
    }
}

.guest-button {
    width: 100%;
    min-height: 3.75rem;
    background: transparent;
    border: 1px solid rgba(162, 155, 254, 0.3);
    border-radius: 16px;
    color: #fff;
    overflow: hidden;
    position: relative;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    animation: breathing-glow 3s infinite ease-in-out;

    &__content {
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.01em;
        color: #fff;
        text-shadow: 0 0 10px rgba(162, 155, 254, 0.5);
    }

    &__icon {
        font-size: 1.5rem;
        color: #fff;
        filter: drop-shadow(0 0 5px var(--accent-color));
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &__bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(162, 155, 254, 0.15), rgba(116, 185, 255, 0.15));
        z-index: 1;
    }

    &__flare {
        position: absolute;
        top: 0;
        left: -150%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transform: skewX(-25deg);
        z-index: 2;
        animation: flare-move 4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    &__glow-ring {
        position: absolute;
        inset: -2px;
        border-radius: 16px;
        padding: 2px;
        background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
        mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        mask-composite: exclude;
        opacity: 0.4;
        z-index: 3;
    }

    &:hover {
        transform: translateY(-4px) scale(1.01);
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 12px 30px -5px var(--glow-color);

        .guest-button__icon {
            transform: scale(1.2) rotate(-10deg);
        }

        .guest-button__bg {
            background: linear-gradient(
                135deg,
                rgba(162, 155, 254, 0.25),
                rgba(116, 185, 255, 0.25)
            );
        }

        .guest-button__glow-ring {
            opacity: 1;
        }
    }

    &:active {
        transform: translateY(-1px) scale(0.98);
    }
}

@keyframes breathing-glow {
    0%,
    100% {
        box-shadow: 0 0 15px -5px rgba(162, 155, 254, 0.2);
        border-color: rgba(162, 155, 254, 0.3);
    }
    50% {
        box-shadow: 0 0 25px 0px rgba(162, 155, 254, 0.5);
        border-color: rgba(162, 155, 254, 0.8);
    }
}

@keyframes flare-move {
    0% {
        left: -150%;
    }
    30%,
    100% {
        left: 200%;
    }
}

:deep(.q-btn__content) {
    z-index: 10;
}

:deep(.q-focus-helper) {
    display: none;
}
</style>
