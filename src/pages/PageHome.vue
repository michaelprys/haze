<script setup lang="ts">
import { date } from 'quasar'
import { onMounted, ref } from 'vue'
import ButtonActive from 'components/ButtonActive.vue'
import { useQuasar } from 'quasar'
import { useStoreProfile } from 'stores/profile.store'
import handleError from 'src/utils/handleError.utils'
import { useStorePosts } from 'src/stores/posts.store'
import type { Post } from 'src/types/post.types'
import ItemAvatar from 'components/ItemAvatar.vue'

const storeProfile = useStoreProfile(),
    storePosts = useStorePosts(),
    $q = useQuasar()

// Posts
const posts = ref<Post[]>([])

const formattedDate = (value: string) => {
    return date.formatDate(value, 'MMMM D, h:mm A')
}

// Update avatar
const avatarModel = ref<File | null>(null)

const handleUpdateAvatar = async () => {
    if (!avatarModel.value) return

    try {
        await storeProfile.updateAvatar(avatarModel.value)

        $q.notify({
            type: 'positive',
            message: 'ItemAvatar updated successfully',
        })
    } catch (error) {
        const message = handleError(error)

        $q.notify({
            type: 'negative',
            message: message ?? 'Error uploading avatar',
        })
    } finally {
        avatarModel.value = null
    }
}

const onAvatarUpdate = async (file: File) => {
    avatarModel.value = file
    await handleUpdateAvatar()
}

// Load posts
const pending = ref(true)

// Skeleton
const showSkeleton = ref(false),
    MIN_SKELETON = 500,
    THRESHOLD = 200
let skeletonTimer: ReturnType<typeof setTimeout> | null = null

const onImageLoad = () => {
    if (skeletonTimer) clearTimeout(skeletonTimer)

    skeletonTimer = setTimeout(() => {
        showSkeleton.value = true

        setTimeout(() => {
            showSkeleton.value = false
        }, MIN_SKELETON)
    }, THRESHOLD)
}

onMounted(async () => {
    try {
        await storeProfile.loadUserInfo()

        const apiPosts = await storePosts.loadPosts()

        posts.value = apiPosts.map((p) => ({
            id: p.id,
            caption: p.caption ?? '',
            location: p.location ?? '',
            photoFile: null,
            photoUrl: p.image_url,
            takenAt: p.taken_at,
        }))
    } catch (error) {
        console.error(handleError(error))
    } finally {
        pending.value = false
    }
})
</script>

<template>
    <q-page class="flex flex-center q-pa-md">
        <div class="content-container">
            <div class="loading-state text-center q-my-xl" v-if="pending">
                <q-spinner-dots color="orange" size="4rem" />
                <div class="q-mt-md text-h6 text-grey-4">Loading your moments...</div>
            </div>
            <div class="empty-profile" v-else-if="posts.length === 0">
                <q-card class="profile-card" flat>
                    <q-card-section class="text-center q-pt-lg q-pb-lg">
                        <div class="avatar-wrapper q-mb-md">
                            <ItemAvatar
                                :avatarSrc="storeProfile.profileInfo?.avatarUrl ?? ''"
                                @update-avatar="onAvatarUpdate"
                                @load="onImageLoad"
                            />
                        </div>

                        <div class="profile-name">{{ storeProfile.profileInfo?.username }}</div>
                        <div class="profile-sub">{{ storeProfile.profileInfo?.bio }}</div>

                        <div class="empty-vibe q-mt-lg q-mb-xl">
                            <div class="empty-main">quiet for now</div>
                            <div class="empty-hint accent-line">waiting for a moment</div>
                        </div>

                        <ButtonActive
                            class="shot-btn"
                            label="Create post"
                            :to="{ name: 'camera-page' }"
                            unelevated
                            rounded
                            dense
                        />
                    </q-card-section>
                </q-card>
            </div>

            <div class="feed" v-else>
                <q-card
                    v-for="post in posts"
                    :key="post.id"
                    class="post-card q-mb-lg"
                    flat
                    bordered
                >
                    <q-item class="q-my-sm post-header">
                        <q-item-section avatar top>
                            <q-avatar size="3rem">
                                <q-img
                                    class="post-avatar"
                                    :src="storeProfile.profileInfo?.avatarUrl ?? ''"
                                    alt="Post image"
                                    @load="onImageLoad"
                                >
                                    <template #loading>
                                        <q-skeleton type="QAvatar" width="100%" height="100%" />
                                    </template>
                                </q-img>
                            </q-avatar>
                        </q-item-section>

                        <q-item-section class="header-text">
                            <q-item-label class="post-username">{{
                                storeProfile.profileInfo?.username
                            }}</q-item-label>
                            <q-item-label class="caption">
                                {{ post.caption }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-img :src="post.photoUrl" class="post-image" @load="onImageLoad">
                        <template #loading>
                            <q-skeleton width="100%" height="100%" />
                        </template>

                        <template #error>
                            <div class="post-placeholder" />
                        </template>
                    </q-img>

                    <q-card-section>
                        <div class="location">
                            {{ post.location }}
                        </div>
                        <div class="date">
                            {{ formattedDate(post.takenAt) }}
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="profile large-screen-only" v-if="posts.length > 0">
                <q-card class="profile-card" flat bordered>
                    <q-card-section class="text-center">
                        <ItemAvatar
                            :avatarSrc="storeProfile.profileInfo?.avatarUrl ?? ''"
                            @update-avatar="onAvatarUpdate"
                        />

                        <div class="profile-name">{{ storeProfile.profileInfo?.username }}</div>
                        <div class="profile-sub">
                            {{ storeProfile.profileInfo?.bio || 'No bio yet' }}
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section class="text-center q-py-md">
                        <ButtonActive
                            label="Create Post"
                            :to="{ name: 'camera-page' }"
                            flat
                            no-caps
                            dense
                            unelevated
                        />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<style lang="sass" scoped>
.q-img__content > .post-placeholder
    position: absolute
    inset: 0
    width: 100%
    height: 100%
    z-index: 22
    background: linear-gradient(160deg, #0d0d0d 0%, #342316 45%, #1a0f0a 70%, #0d0d0d 100%)
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 0.8rem
    font-family: Georgia, serif
    color: #ffab6e

    &::before
        content: "✧･ﾟ"
        font-size: 5.8rem
        letter-spacing: -0.18em
        opacity: 0.38
        color: #ffc18a
        text-shadow: 0 0 15px rgba(255, 154, 94, 0.5), 0 0 30px rgba(255, 120, 60, 0.25)

    &::after
        content: "lost image"
        font-size: 1.18rem
        font-style: italic
        letter-spacing: 0.09em
        opacity: 0.78
        color: #ffbb90

.content-container
    width: 100%
    max-width: 75rem
    display: flex
    justify-content: center
    align-items: flex-start
    gap: 4rem

.empty-profile
    width: 100%
    max-width: 30rem
    height: 100%
    display: flex
    align-items: center
    justify-content: center

.profile
    flex: 0 0 22rem

.profile-card
    background-color: #0d0d0d
    border-radius: 1.75rem
    border: 1px solid rgba(255, 160, 50, 0.22)
    backdrop-filter: blur(1.125rem)
    box-shadow: 0 1.875rem 6.25rem rgba(0,0,0,0.92), 0 0 0 0.0625rem rgba(255, 160, 50, 0.08) inset
    width: 100%

.profile-name
    font-size: 1.5rem
    font-weight: 700
    margin-bottom: 0.3rem
    text-shadow: 0 0.0625rem 0.25rem rgba(0,0,0,0.8)

.profile-sub
    font-size: 0.8rem
    color: #c8a070
    font-weight: 300
    letter-spacing: 0.0625rem

.no-photo-overlay
    position: absolute
    inset: 0
    background: linear-gradient(135deg, #1a1a1a, #0d0d0d)
    display: flex
    align-items: center
    justify-content: center
    color: #666
    font-size: 1.4rem
    font-weight: 500
    text-shadow: 0 0.0625rem 0.25rem #000

    &::before
        content: "No Photo"
        opacity: 0.7

.empty-vibe
    text-align: center
    font-weight: 300

.empty-main
    font-size: 1.45rem
    line-height: 1.4
    color: #c0c0ff
    margin-bottom: 0.5rem
    letter-spacing: -0.01875rem

.empty-hint
    font-size: 1.05rem
    line-height: 1.5
    color: #ffaa60
    opacity: 0.9
    font-weight: 400
    letter-spacing: 0.0125rem

.accent-line
    color: #ffaa60
    font-weight: 500
    text-shadow: 0 0 0.5rem rgba(255, 170, 96, 0.4)

.shot-btn
    background: linear-gradient(90deg, #ffbe30, #ff7a00, #ffbe30, #ff7a00)
    background-size: 300% 100%
    animation: gradientFlow 4s ease infinite
    color: #ffffff
    font-weight: 800
    font-size: 1.1rem
    letter-spacing: 0.03125rem
    padding: 0.75rem 2.2rem
    border-radius: 62.4375rem
    box-shadow: 0 0.3125rem 0.9375rem rgba(255, 130, 0, 0.45)
    transition: all 0.28s ease
    text-transform: uppercase
    line-height: 1.1

    .q-icon
        font-size: 1.35rem
        margin-left: 0.7rem
        transition: transform 0.3s ease

    &:hover .q-icon
        transform: translateX(0.25rem)

@keyframes gradientFlow
    0%
        background-position: 0 50%
    50%
        background-position: 100% 50%
    100%
        background-position: 0 50%

.feed
    width: 100%
    max-width: 40rem

.post-card
    background-color: #0d0d0d
    border-radius: 1.5rem
    border: 1px solid rgba(255, 160, 50, 0.15)
    box-shadow: 0 1.25rem 5rem rgba(0,0,0,0.8)

.post-image
    width: 100%
    max-height: 28rem
    aspect-ratio: 16/9

.post-username
    font-weight: 600
    color: #ffe8c0

.post-header
    align-items: flex-start

.post-avatar
    width: 100%
    height: 100%

.header-text
    display: flex
    flex-direction: column
    align-items: flex-start

.caption
    font-size: 1rem
    margin-top: 0.25rem
    word-break: break-word

.location
    color: #ff9c30
    font-size: 0.9rem

.date
    color: #b08040
    font-size: 0.78rem
    margin-top: 0.3rem


.profile.large-screen-only
    width: 24rem
    position: sticky
    top: 6rem

@media (width <= 68.75rem)
    .content-container
        flex-direction: column-reverse
        align-items: center
        gap: 3rem

    .profile
        flex: initial

    .profile.large-screen-only
        position: static

@media (width <= $breakpoint-xs-max)
    .profile.large-screen-only
        display: none

    .empty-profile
        padding: 1rem

    .profile-name
        font-size: 1.8rem

    .empty-vibe
        font-size: 1.05rem
</style>
