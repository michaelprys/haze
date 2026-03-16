<script setup lang="ts">
import type { Post } from 'src/types/post.types';
import { useStoreProfile } from 'stores/profile.store';
import { date } from 'quasar';

const props = withDefaults(
    defineProps<{
        post: Post;
        initial?: string | undefined;
    }>(),
    {
        initial: '',
    },
);

const storeProfile = useStoreProfile();

const formattedDate = (value: string) => {
    return date.formatDate(value, 'MMMM D, h:mm A');
};

const emit = defineEmits(['showModal']);
</script>

<template>
    <article class="card-post">
        <header class="card-post__header">
            <div class="card-post__wrapper">
                <q-avatar size="3rem" class="card-post__avatar">
                    <q-img
                        class="card-post__avatar-image"
                        v-if="storeProfile.profileInfo?.avatarUrl"
                        :src="storeProfile.profileInfo.avatarUrl"
                    >
                        <template #loading>
                            <q-skeleton width="100%" height="100%" type="QAvatar" />
                        </template>
                    </q-img>
                    <div v-else class="card-post__avatar-placeholder">
                        {{ props.initial }}
                    </div>
                </q-avatar>
                <div class="card-post__user-info">
                    <div>
                        <q-skeleton
                            v-if="!storeProfile.profileInfo"
                            width="14rem"
                            height="1.5rem"
                        />

                        <span v-else class="card-post__username">{{
                            storeProfile.profileInfo?.username
                        }}</span>
                    </div>

                    <div class="q-mt-sm">
                        <q-skeleton v-if="!post" width="9rem" height="1.3505625rem" />

                        <p v-else class="card-post__caption">{{ props.post.caption }}</p>
                    </div>
                </div>
            </div>

            <q-btn
                class="card-post__delete-button"
                flat
                round
                unelevated
                icon="close"
                size="10px"
                @click="emit('showModal')"
            />
        </header>

        <q-separator dark />

        <div class="card-post__media">
            <q-img :src="props.post.photoUrl || undefined" class="card-post__image">
                <template #loading>
                    <q-skeleton width="100%" height="100%" />
                </template>

                <template #error>
                    <div class="card-post__image-error">
                        <span class="card-post__error-icon">✧･ﾟ</span>
                        <span class="card-post__error-text">lost image</span>
                    </div>
                </template>
            </q-img>
        </div>

        <footer class="card-post__footer">
            <div class="card-post__location">
                <q-skeleton v-if="!post" width="10rem" height="1.274375rem" />

                <span v-else>
                    {{ props.post.location }}
                </span>
            </div>

            <div class="card-post__date q-mt-sm">
                <q-skeleton v-if="!post" width="8rem" height="1.125rem" />

                <span v-else>
                    {{ formattedDate(props.post.takenAt) }}
                </span>
            </div>
        </footer>
    </article>
</template>

<style lang="scss" scoped>
@use 'src/css/custom.variables.scss' as *;

.card-post {
    background-color: $color-bg;
    border: 1px solid $color-border;
    border-radius: 1.5rem;
    margin-bottom: 2rem;
    overflow: hidden;
    transition: transform 0.3s ease;

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
        justify-content: space-between;
    }

    &__wrapper {
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
    }

    &__avatar-image {
        height: 100%;
        width: 100%;
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

    &__delete-button {
        backdrop-filter: blur(0.25rem);
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 3%);
        color: rgb(255 255 255 / 30%);
        height: 1.75rem;
        margin-right: 1.5rem;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        width: 1.75rem;

        &:hover {
            background: rgb(255 77 79 / 8%);
            border-color: rgb(255 77 79 / 20%);
            color: #ff4d4f;
            transform: scale(1.1);
        }

        &:active {
            background: rgb(255 77 79 / 15%);
            transform: scale(0.9);
        }

        :deep(.q-icon) {
            font-size: 0.875rem;
            font-weight: 300;
        }
    }
}
</style>
