<script setup lang="ts">
import { useStoreProfile } from 'stores/profile.store';
import type { Post } from 'src/types/post.types';
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

const emit = defineEmits<{
    (e: 'showModal', postId: string): void;
}>();
</script>

<template>
    <article class="card-post">
        <header class="card-post__header">
            <div class="card-post__wrapper">
                <q-avatar size="3rem" class="card-post__avatar">
                    <q-img
                        class="card-post__avatar-image"
                        v-if="storeProfile.profileInfo?.avatarUrl"
                        :src="storeProfile.profileInfo.avatarUrl">
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
                            height="1.5rem" />

                        <span v-else class="card-post__username">
                            {{ storeProfile.profileInfo?.username }}
                        </span>
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
                @click="emit('showModal', props.post.id)" />
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
    margin-bottom: 2rem;
    overflow: hidden;
    background-color: $color-bg;
    border: 1px solid $color-border;
    border-radius: 1.5rem;
    transition: transform 0.3s ease;

    &__skeleton {
        width: 100%;
        height: 100%;
        background: rgb(255 255 255 / 5%);
    }

    &__skeleton-overlay {
        position: absolute;
        inset: 0;
        z-index: 10;
        background: $color-bg;
    }

    &__image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }

    &__user-info {
        display: flex;
        flex-direction: column;
    }

    &__username {
        font-size: 1rem;
        font-weight: 600;
        color: #ffe8c0;
    }

    &__caption {
        margin: 0;
        font-size: 0.9rem;
        color: #eee;
    }

    &__media {
        position: relative;
        aspect-ratio: 16/9;
        background: #111;
    }

    &__image-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(160deg, #0d0d0d, #1a0f0a);
        color: $color-accent;
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
        font-size: 0.85rem;
        color: $color-accent;
    }

    &__date {
        font-size: 0.75rem;
        color: $color-text-muted;
    }

    &__avatar-image {
        width: 100%;
        height: 100%;
    }

    &__avatar-placeholder {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        font-weight: bold;
        background: linear-gradient(145deg, #444, #222);
        color: #ffe8c0;
    }

    &__delete-button {
        width: 1.75rem;
        height: 1.75rem;
        backdrop-filter: blur(0.25rem);
        background: rgb(255 255 255 / 5%);
        color: rgb(255 255 255 / 30%);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        margin-right: 1.5rem;
        border: 1px solid rgb(255 255 255 / 3%);

        &:hover {
            transform: scale(1.1);
            background: rgb(255 77 79 / 8%);
            color: #ff4d4f;
            border-color: rgb(255 77 79 / 20%);
        }

        &:active {
            transform: scale(0.9);
            background: rgb(255 77 79 / 15%);
        }

        :deep(.q-icon) {
            font-size: 0.875rem;
            font-weight: 300;
        }
    }
}
</style>
