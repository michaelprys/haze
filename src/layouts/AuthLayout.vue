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
                <div class="logo-glow q-mb-md">
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

            <q-card class="auth-card q-mt-xl" flat bordered>
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

.logo-image
    width: 5rem
    height: 5rem

.auth-card
    width: 100%
    background-color: #121212
    border-radius: 20px
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6)

.bottom-text
    color: #777
    font-size: 0.85rem

:global(.auth-button)
    height: 44px
    border-radius: 12px
    font-weight: 600
    letter-spacing: 0.5px
    background: linear-gradient(135deg, #ff9500, #ff3a00)
    box-shadow: 0 8px 20px rgba(255, 80, 0, 0.35)
    transition: all 0.25s ease

:global(.auth-button:hover)
    box-shadow: 0 12px 28px rgba(255, 80, 0, 0.5)


:global(.auth-link)
    color: #ff6d00
    font-weight: 600
    cursor: pointer
    margin-left: 4px
    transition: 0.2s
    text-decoration: none

:global(.auth-link:hover)
    color: #ff3a00
</style>
