<script setup lang="ts">
defineProps<{
    title: string
    subtitle: string
}>()
</script>

<template>
    <q-page class="auth-page flex flex-center">
        <div class="auth-container">
            <div class="text-center">
                <div class="logo-glow">
                    <img
                        class="logo-image"
                        src="/src/assets/logo.webp"
                        width="1024"
                        height="1024"
                        alt="Hze logo"
                    />
                </div>

                <div class="auth-title">{{ title }}</div>
                <div class="auth-subtitle">{{ subtitle }}</div>
            </div>

            <q-card class="auth-card q-mt-lg" flat bordered>
                <q-card-section>
                    <slot name="form" />
                </q-card-section>
            </q-card>

            <div class="bottom-text text-center q-mt-lg">
                <slot name="footer" />
            </div>
        </div>
    </q-page>
</template>

<style scoped lang="sass">
.auth-page
    min-height: 100svh

.auth-container
    width: 100%
    max-width: 30rem
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
    border-radius: 1.25rem
    box-shadow: 0 0 0.9375rem rgba(255, 149, 0, 0.4)

.logo-image
    width: 5rem
    height: 5rem
    margin-top: 0.3125rem
    margin-left: 0.0625rem

.auth-card
    width: 100%
    background-color: #121212
    border-radius: 1.25rem
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 0.9375rem 2.5rem rgba(0, 0, 0, 0.6)

.bottom-text
    color: #777
    font-size: 0.85rem

:global(.auth-button)
    height: 2.75rem
    border-radius: 0.75rem
    font-weight: 600
    letter-spacing: 0.03125rem
    background: linear-gradient(135deg, #ff9500, #ff3a00)
    box-shadow: 0 0.5rem 1.25rem rgba(255, 80, 0, 0.35)
    transition: all 0.25s ease

:global(.auth-button:hover)
    box-shadow: 0 0.75rem 1.75rem rgba(255, 80, 0, 0.5)


:global(.auth-link)
    color: #ff6d00
    font-weight: 600
    cursor: pointer
    margin-left: 0.25rem
    transition: 0.2s
    text-decoration: none

:global(.auth-link:hover)
    color: #ff3a00
</style>
