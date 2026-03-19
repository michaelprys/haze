<script setup lang="ts">
import Logo from 'assets/images/logo.webp';

defineProps<{
    title: string;
    subtitle: string;
}>();
</script>

<template>
    <q-page class="auth">
        <div class="auth__container">
            <div class="auth__header">
                <div class="auth__logo-wrapper">
                    <img
                        class="auth__logo"
                        alt="Haze logo"
                        :src="Logo"
                        width="80"
                        height="80"
                        loading="eager"
                        fetchpriority="high" />
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
        box-shadow: 0 0 0.9375rem rgb(255 149 0 / 40%);
        background: rgb(255 149 0 / 10%);
        border-radius: 1.25rem;
    }

    &__logo {
        width: 5rem;
        height: 5rem;
        margin-top: 0.3125rem;
        margin-left: 0.0625rem;
    }

    &__title {
        font-size: 1.8rem;
        font-weight: 700;
        color: rgb(255 255 255 / 100%);
    }

    &__subtitle {
        font-size: 0.9rem;
        color: rgb(119 119 119 / 100%);
    }

    &__card {
        width: 100%;
        box-shadow: 0 0.9375rem 2.5rem rgb(0 0 0 / 60%);
        background-color: rgb(18 18 18 / 100%);
        border: 1px solid rgb(255 120 0 / 15%);
        border-radius: 1.25rem;
    }

    &__footer {
        font-size: 0.85rem;
        color: rgb(119 119 119 / 100%);
        text-align: center;
    }

    :deep() {
        .auth-button {
            width: 100%;
            height: 2.75rem;
            letter-spacing: 0.03125rem;
            background: linear-gradient(135deg, #ff9500, #ff3a00);
            border-radius: 0.75rem;
            transition:
                transform 0.2s ease,
                box-shadow 0.2s ease,
                background-position 2s ease;

            &:hover {
                box-shadow: 0 0.75rem 1.75rem rgb(255 80 0 / 50%);
            }
        }

        .auth-link {
            font-weight: 600;
            color: #ff9500;
            cursor: pointer;
            transition: 0.2s;
            margin-left: 0.25rem;
            text-decoration: none;

            &:hover {
                color: #ff3a00;
            }
        }

        .q-field__control {
            background: rgb(255 255 255 / 2%);
            border-radius: 0.75rem;
        }

        .q-field__label {
            color: #aaa;
        }
    }
}
</style>
