<script setup lang="ts">
import { date } from 'quasar';
import { onMounted, ref } from 'vue';
import ButtonActive from 'components/ButtonActive.vue';
import { useQuasar } from 'quasar';
import { useStoreProfile } from 'stores/profile.store';
import handleError from 'src/utils/handleError.utils';
import { useStorePosts } from 'src/stores/posts.store';
import type { Post } from 'src/types/post.types';
import ItemAvatar from 'components/ItemAvatar.vue';

const storeProfile = useStoreProfile(),
    storePosts = useStorePosts(),
    $q = useQuasar();

// Posts
const posts = ref<Post[]>([]);

const formattedDate = (value: string) => {
    return date.formatDate(value, 'MMMM D, h:mm A');
};

// Avatar
const avatarModel = ref<File | null>(null),
    initial = storeProfile.profileInfo?.username?.charAt(0);

const handleUpdateAvatar = async () => {
    if (!avatarModel.value) return;

    try {
        await storeProfile.updateAvatar(avatarModel.value);

        $q.notify({
            type: 'positive',
            message: 'Avatar updated successfully',
        });
    } catch (error) {
        const message = handleError(error);

        $q.notify({
            type: 'negative',
            message: message ?? 'Error uploading avatar',
        });
    } finally {
        avatarModel.value = null;
    }
};

const onAvatarUpdate = async (file: File) => {
    avatarModel.value = file;
    await handleUpdateAvatar();
};

// Posts
const pending = ref(true);

// Skeleton
const showSkeleton = ref(false),
    MIN_SKELETON = 500,
    THRESHOLD = 200;
let skeletonTimer: ReturnType<typeof setTimeout> | null = null;

const onImageLoad = () => {
    if (skeletonTimer) clearTimeout(skeletonTimer);

    skeletonTimer = setTimeout(() => {
        showSkeleton.value = true;

        setTimeout(() => {
            showSkeleton.value = false;
        }, MIN_SKELETON);
    }, THRESHOLD);
};

onMounted(async () => {
    try {
        await storeProfile.loadUserInfo();

        const apiPosts = await storePosts.loadPosts();

        posts.value = apiPosts.map((p) => ({
            id: p.id,
            caption: p.caption ?? '',
            location: p.location ?? '',
            photoFile: null,
            photoUrl: p.image_url,
            takenAt: p.taken_at,
        }));
    } catch (error) {
        console.error(handleError(error));
    } finally {
        pending.value = false;
    }
});
</script>

<template>
    <q-page class="profile q-pa-md">
        <div class="profile__container">
            <div v-if="pending" class="profile__loading">
                <q-spinner-dots color="orange" size="4rem" />
                <div class="profile__loading-text">Loading your moments...</div>
            </div>

            <template v-else>
                <div v-if="posts.length === 0" class="profile__empty">
                    <section class="user-card user-card--hero">
                        <div class="user-card__avatar-wrapper">
                            <ItemAvatar
                                :avatar-src="storeProfile.profileInfo?.avatarUrl"
                                :initial="initial"
                                @update-avatar="onAvatarUpdate"
                            />
                        </div>
                        <h1 class="user-card__name">{{ storeProfile.profileInfo?.username }}</h1>
                        <p class="user-card__bio user-card__bio--accent">
                            {{ storeProfile.profileInfo?.bio ?? 'No bio yet' }}
                        </p>
                        <ButtonActive
                            class="user-card__action-btn"
                            label="Create Post"
                            :to="{ name: 'camera-page' }"
                        />
                    </section>
                </div>

                <div v-else class="profile__feed feed">
                    <article v-for="post in posts" :key="post.id" class="post-card">
                        <header class="post-card__header">
                            <q-avatar size="3rem" class="post-card__avatar">
                                <q-img
                                    v-if="storeProfile.profileInfo?.avatarUrl"
                                    :src="storeProfile.profileInfo.avatarUrl"
                                >
                                    <template #loading>
                                        <q-skeleton width="100%" height="100%" type="QAvatar" />
                                    </template>
                                </q-img>
                                <div v-else class="post-card__avatar-placeholder">
                                    {{ initial }}
                                </div>
                            </q-avatar>
                            <div class="post-card__user-info">
                                <span class="post-card__username">{{
                                    storeProfile.profileInfo?.username
                                }}</span>
                                <p class="post-card__caption">{{ post.caption }}</p>
                            </div>
                        </header>

                        <q-separator dark />

                        <div class="post-card__media">
                            <q-img
                                :src="post.photoUrl"
                                class="post-card__image"
                                @load="onImageLoad"
                            >
                                <template #loading>
                                    <q-skeleton width="100%" height="100%" />
                                </template>
                                <template #error>
                                    <div class="post-card__image-error">
                                        <span class="post-card__error-icon">✧･ﾟ</span>
                                        <span class="post-card__error-text">lost image</span>
                                    </div>
                                </template>
                            </q-img>
                        </div>

                        <footer class="post-card__footer">
                            <div class="post-card__location">{{ post.location }}</div>
                            <div class="post-card__date">{{ formattedDate(post.takenAt) }}</div>
                        </footer>
                    </article>
                </div>

                <aside v-if="posts.length > 0" class="profile__sidebar">
                    <div class="user-card">
                        <div class="user-card__content">
                            <ItemAvatar
                                :avatar-src="storeProfile.profileInfo?.avatarUrl ?? ''"
                                :initial="initial"
                                @update-avatar="onAvatarUpdate"
                            />
                            <div class="user-card__info">
                                <div class="user-card__name">
                                    {{ storeProfile.profileInfo?.username ?? 'User' }}
                                </div>
                                <div class="user-card__bio">
                                    {{ storeProfile.profileInfo?.bio || 'No bio yet' }}
                                </div>
                            </div>
                        </div>

                        <q-separator class="q-my-sm" dark />

                        <ButtonActive
                            flat
                            no-caps
                            label="Create Post"
                            class="full-width"
                            :to="{ name: 'camera-page' }"
                        />
                    </div>
                </aside>
            </template>
        </div>
    </q-page>
</template>

<style lang="scss" scoped>
$color-bg: #0d0d0d;
$color-accent: #ff9c30;
$color-border: rgb(255 160 50 / 15%);
$color-text-muted: #b08040;

.profile {
    display: grid;
    place-items: center;

    &__container {
        display: flex;
        align-items: flex-start;
        gap: 4rem;
        justify-content: center;
        max-width: 75rem;
        width: 100%;
    }

    &__loading {
        margin: 5rem 0;
        text-align: center;

        &-text {
            color: #9e9e9e;
            font-size: 1.25rem;
            margin-top: 1rem;
        }
    }

    &__empty {
        max-width: 32rem;
        width: 100%;
    }

    &__feed {
        flex: 1;
        max-width: 40rem;
    }

    &__sidebar {
        flex: 0 0 22rem;
        position: sticky;
        top: 6rem;

        @media (width <= 55rem) {
            display: none;
        }
    }
}

.user-card {
    align-items: center;
    backdrop-filter: blur(18px);
    background-color: $color-bg;
    border: 1px solid $color-border;
    border-radius: 1.75rem;
    box-shadow: 0 30px 100px rgb(0 0 0 / 90%);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    text-align: center;

    &--hero {
        width: 100%;
    }

    &__name {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        margin-top: 1rem;
    }

    &__bio {
        color: #c8a070;
        font-size: 0.9rem;
        font-weight: 300;
        margin-top: 0.5rem;

        &--accent {
            color: $color-accent;
            font-weight: 500;
        }
    }

    &__action-btn {
        animation: gradientFlow 4s ease infinite;
        background: linear-gradient(90deg, #ffbe30, #ff7a00);
        background-size: 200% auto;
        border-radius: 50px;
        font-weight: 800;
        margin-top: 0.5rem;
        text-transform: uppercase;
    }
}

.post-card {
    background-color: $color-bg;
    border: 1px solid $color-border;
    border-radius: 1.5rem;
    margin-bottom: 2rem;
    overflow: hidden;
    transition: transform 0.3s ease;

    &__media {
        aspect-ratio: 16/9;
        background: #111;
        overflow: hidden;
        position: relative;
    }

    &__skeleton {
        background: rgb(255 255 255 / 5%);
        height: 100%;
        width: 100%;
    }

    &__skeleton-overlay {
        background: $color-bg;
        inset: 0;
        position: absolute;
        z-index: 10;
    }

    &__image {
        display: block;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    &__header {
        align-items: center;
        display: flex;
        gap: 1rem;
        padding: 1rem;
    }

    &__user-info {
        display: flex;
        flex-direction: column;
    }

    &__username {
        color: #ffe8c0;
        font-size: 1rem;
        font-weight: 600;
    }

    &__caption {
        color: #eee;
        font-size: 0.9rem;
        margin: 0;
    }

    &__media {
        aspect-ratio: 16/9;
        background: #111;
        position: relative;
    }

    &__image-error {
        align-items: center;
        background: linear-gradient(160deg, #0d0d0d, #1a0f0a);
        color: $color-accent;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        width: 100%;
    }

    &__error-icon {
        font-size: 4rem;
        opacity: 0.4;
    }

    &__error-text {
        font-style: italic;
        letter-spacing: 0.1em;
        opacity: 0.8;
    }

    &__footer {
        padding: 1rem;
    }

    &__location {
        color: $color-accent;
        font-size: 0.85rem;
    }

    &__date {
        color: $color-text-muted;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }

    &__avatar-placeholder {
        background: linear-gradient(145deg, #fce8e0, #f0a67f);
        color: #7a5c44;
        display: grid;
        font-weight: bold;
        height: 100%;
        place-items: center;
        width: 100%;
    }
}

@keyframes gradientFlow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
