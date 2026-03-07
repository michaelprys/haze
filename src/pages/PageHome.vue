<script setup lang="ts">
import { date } from 'quasar'
import { ref, watchEffect } from 'vue'
import ActionButton from 'components/ActionButton.vue'
// import type { PostTypes } from 'src/types/post.types'
import { useQuasar } from 'quasar'
import { useStoreProfile } from 'stores/userData.store'
import handleError from 'src/utils/handleError.utils'

const $q = useQuasar()
const storeProfile = useStoreProfile()

// Posts
const posts = [
    {
        id: 1,
        caption: 'Travel Photo',
        date: 1772543224326,
        location: 'Taipei, Taiwan',
        imageUrl: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
    {
        id: 2,
        caption: 'Travel Photo',
        date: 1772543224326,
        location: 'Kaohsiung, Taiwan',
        imageUrl: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
]

const formattedDate = (value: number) => {
    return date.formatDate(value, 'MMMM D, h:mm A')
}

const avatarSrc = ref('https://cdn.quasar.dev/img/boy-avatar.png')
const avatarModel = ref<File | null>(null)

const handleUpdateAvatar = async () => {
    try {
        await storeProfile.updateAvatar(avatarModel.value)

        const timestamp = Date.now()
        avatarSrc.value = `${storeProfile.currentAvatarUrl || 'https://cdn.quasar.dev/img/boy-avatar.png'}?t=${timestamp}`

        $q.notify({
            type: 'positive',
            message: 'Avatar updated successfully',
        })
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error uploading avatar',
        })
    }
}

watchEffect(() => {
    console.log(avatarModel)
})
</script>

<template>
    <q-page class="feed-page flex flex-center q-pa-md">
        <div class="layout">
            <div class="feed">
                <q-card
                    v-for="post in posts"
                    :key="post.id"
                    class="post-card q-mb-lg"
                    flat
                    bordered
                >
                    <q-item>
                        <q-item-section avatar>
                            <q-avatar size="48px">
                                <q-img :src="post.imageUrl" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label class="username">MichaelPrys</q-item-label>
                            <q-item-label caption class="caption">
                                {{ post.caption }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-img class="post-image" src="https://unsplash.it/600" />

                    <q-card-section>
                        <div class="location">
                            {{ post.location }}
                        </div>
                        <div class="date">
                            {{ formattedDate(post.date) }}
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="profile large-screen-only">
                <q-card class="profile-card" flat bordered>
                    <q-card-section class="text-center">
                        <div class="avatar-wrapper">
                            <q-avatar size="90px">
                                <q-img :src="avatarSrc" alt="Profile picture" />
                            </q-avatar>

                            <q-file
                                v-model="avatarModel"
                                @update:model-value="handleUpdateAvatar"
                                class="avatar-overlay"
                                flat
                            >
                                <q-icon name="edit" class="overlay-icon"
                            /></q-file>
                        </div>

                        <div class="profile-name">MichaelPrys</div>
                        <div class="profile-sub">Traveller</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <ActionButton
                            label="Create Post"
                            :to="{ name: 'camera-page' }"
                            icon="add_a_photo"
                        />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<style lang="sass">
.feed-page
    min-height: 100vh
    background-color: #0f0f0f

.layout
    display: flex
    justify-content: center
    gap: 3rem
    align-items: flex-start
    width: 100%

.feed
    width: 100%
    max-width: 37.5rem

.profile
    width: 22rem
    position: sticky
    top: 6rem
    transition: all 0.25s ease

.profile.large-screen-only
    opacity: 1
    transform: translateY(0)
    pointer-events: auto

@media (width <= $breakpoint-xs-max)
    .profile.large-screen-only
        opacity: 0
        transform: translateY(10px)
        pointer-events: none

.post-card
    background-color: #121212
    border-radius: 20px
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6)

.post-image
    max-height: 25rem

.username
    font-weight: bold
    color: #ffffff

.caption
    color: #ff9a3c

.location
    color: #ff7a00
    font-size: 0.9rem

.date
    color: #777
    font-size: 0.75rem
    margin-top: 0.25rem

.avatar-wrapper
    position: relative
    display: inline-block
    cursor: pointer

    .avatar-overlay
        position: absolute
        inset: 0
        border-radius: 50%
        display: flex
        align-items: center
        justify-content: center
        background: linear-gradient(135deg, rgba(255, 154, 0, 0.35), rgba(255, 94, 0, 0.35))
        opacity: 0
        transition: opacity 0.3s ease

    .overlay-icon
        font-size: 22px
        color: white
        transform: scale(0.9)
        transition: transform 0.25s ease

    &::before
        content: ""
        position: absolute
        inset: -4px
        border-radius: 50%
        padding: 3px
        background: conic-gradient(from 0deg, #ff9a00, #ff6a00, #ffb347, #ff7a18, #ff9a00)
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%)
        mask: radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%)
        opacity: 0
        transition: opacity 0.35s ease
        animation: lava-spin 6s linear infinite

    &:hover
        .avatar-overlay
            opacity: 1

        .overlay-icon
            transform: scale(1)

        &::before
            opacity: 1

@keyframes lava-spin
    from
        transform: rotate(0deg)
    to
        transform: rotate(360deg)

.overlay-btn
    color: white

.profile-card
    background-color: #121212
    border-radius: 20px
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6)

.profile-name
    font-weight: bold
    color: #ffffff
    margin-top: 1rem

.profile-sub
    color: #aaa
    font-size: 0.85rem

.create-btn
    background: linear-gradient(135deg, #ffb347, #ff7a00, #ff3d00, #ffb347)
    background-size: 400% 400%
    color: white
    font-weight: 600
    border-radius: 999px
    animation: gtaGradient 5s ease infinite

@keyframes gtaGradient
    0%
        background-position: 0% 50%
    50%
        background-position: 100% 50%
    100%
        background-position: 0% 50%
</style>
