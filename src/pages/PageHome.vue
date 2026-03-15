<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ButtonActive from 'components/common/ButtonActive.vue';
import { useStoreProfile } from 'stores/profile.store';
import ItemAvatar from 'components/profile/ItemAvatar.vue';
import { useStorePosts } from 'src/stores/posts.store';
import handleError from 'src/utils/handleError.utils';
import CardPost from 'components/profile/CardPost.vue';
import type { Post } from 'src/types/post.types';
import CardProfile from 'components/profile/CardProfile.vue';

const storeProfile = useStoreProfile();
const storePosts = useStorePosts();
const loading = ref(true);
const posts = ref<Post[]>([]);
const initial = storeProfile.profileInfo?.username?.charAt(0);

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
        loading.value = false;
    }
});
</script>

<template>
    <q-page class="dashboard q-pa-md">
        <div v-if="loading" class="dashboard__loading">
            <q-spinner-dots color="orange" size="4rem" />
            <div class="dashboard__loading-text">Loading your moments...</div>
        </div>

        <div v-else class="dashboard__container">
            <section class="dashboard__content">
                <div v-if="posts.length === 0" class="dashboard__empty">
                    <section class="card-profile card-profile--hero">
                        <div class="card-profile__avatar-wrapper">
                            <ItemAvatar
                                :avatar-src="storeProfile.profileInfo?.avatarUrl"
                                :initial="initial"
                            />
                        </div>
                        <h1 class="card-profile__username">
                            {{ storeProfile.profileInfo?.username }}
                        </h1>
                        <p class="card-profile__bio card-profile__bio--accent">
                            {{ storeProfile.profileInfo?.bio ?? 'No bio yet' }}
                        </p>

                        <ButtonActive
                            class="card-profile__action-button"
                            label="Create Post"
                            :to="{ name: 'camera-page' }"
                        />
                    </section>
                </div>
                <div v-else>
                    <CardPost
                        v-for="post in posts"
                        :key="post.id"
                        :post="post"
                        :initial="initial"
                    />
                </div>
            </section>

            <aside class="dashboard__sidebar">
                <CardProfile />
            </aside>
        </div>
    </q-page>
</template>

<style lang="scss" scoped>
.dashboard {
    display: grid;
    place-items: center;

    &__loading {
        margin: 5rem 0;
        text-align: center;

        &-text {
            color: #9e9e9e;
            font-size: 1.25rem;
            margin-top: 1rem;
        }
    }

    &__container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 4rem;
        max-width: 75rem;
        width: 100%;
    }

    &__content {
        flex: 1;
        max-width: 40rem;
    }

    &__sidebar {
        width: 20rem;
        flex-shrink: 0;
        position: sticky;
        top: 6rem;

        @media (width <= 55rem) {
            display: none;
        }
    }

    &__empty {
        max-width: 32rem;
        width: 100%;
    }
}
</style>
