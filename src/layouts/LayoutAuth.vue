<script setup lang="ts">
import Logo from 'assets/images/logo.webp';
import { ref } from 'vue';

defineProps<{
    title: string;
    subtitle: string;
}>();

const isLogoLoaded = ref(false);
</script>

<template>
    <q-page class="auth">
        <div class="auth__container">
            <div class="auth__header">
                <div
                    class="auth__logo-wrapper"
                    :class="{ 'auth__logo-wrapper--loading': !isLogoLoaded }">
                    <img
                        class="auth__logo"
                        :class="{ 'auth__logo--loaded': isLogoLoaded }"
                        alt="Haze logo"
                        :src="Logo"
                        width="80"
                        height="80"
                        loading="eager"
                        fetchpriority="high"
                        @load="isLogoLoaded = true" />
                </div>

                <div class="auth__title">{{ title }}</div>
                <div class="auth__subtitle">{{ subtitle }}</div>
            </div>

            <q-card bordered class="auth__card q-mt-lg" flat>
                <q-card-section>
                    <slot name="form" />
                </q-card-section>
            </q-card>

            <div class="auth__footer q-mt-lg">
                <slot name="footer" />
            </div>
        </div>
    </q-page>
</template>

<style lang="scss" scoped>
.auth {
    display: grid;
    place-items: center;
    min-height: 100svh;

    &__container {
        max-width: 30rem;
        width: 100%;
        padding: 2rem;
    }

    &__header {
        text-align: center;
    }

    &__logo-wrapper {
        display: inline-flex;
        width: 5rem;
        height: 5rem;
        background: rgb(255 149 0 / 8%);
        border-radius: 1.25rem;
        box-shadow: 0 0 1.5rem rgb(255 149 0 / 15%);
        transition: all 0.5s ease;

        &--loading {
            animation: breath 2s infinite ease-in-out;
            box-shadow: 0 0 1rem rgb(255 149 0 / 5%);
        }
    }

    &__logo {
        width: 5rem;
        height: 5rem;
        margin-top: 0.3125rem;
        margin-left: 0.0625rem;
        opacity: 0;
        transition: opacity 0.6s ease;
        &--loaded {
            opacity: 1;
        }
    }

    &__title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #fff;
        margin-top: 1rem;
    }

    &__subtitle {
        font-size: 0.9rem;
        color: #777;
    }

    &__card {
        background-color: #121212;
        border: 1px solid rgb(255 120 0 / 15%);
        border-radius: 1.25rem;
        box-shadow: 0 0.9375rem 2.5rem rgb(0 0 0 / 60%);
    }

    &__footer {
        font-size: 0.85rem;
        color: #777;
        text-align: center;
    }

    @keyframes breath {
        0%,
        100% {
            opacity: 0.5;
            background: rgb(255 149 0 / 4%);
        }
        50% {
            opacity: 1;
            background: rgb(255 149 0 / 12%);
        }
    }

    :deep() {
        .auth-button {
            width: 100%;
            height: 2.75rem;
            background: linear-gradient(135deg, #ff9500, #ff3a00);
            border-radius: 0.75rem;
            font-weight: 600;
        }

        .auth-link {
            color: #ff9500;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s ease;
            cursor: pointer;
            margin-left: 0.25rem;

            &:hover {
                color: #ff3a00;
            }
        }

        .q-field__control {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 0.75rem;
        }
    }
}
</style>
