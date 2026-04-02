<script setup lang="ts">
import ProfileCard from 'components/profile/ProfileCard.vue';
import { useStorePosts } from 'src/stores/posts.store';
import { useStoreProfile } from 'stores/profile.store';
import PostModal from 'components/post/PostModal.vue';
import handleError from 'src/utils/handleError.utils';
import PostCard from 'components/post/PostCard.vue';
import type { Post } from 'src/types/post.types';
import { onMounted, ref } from 'vue';

const storeProfile = useStoreProfile(),
    storePosts = useStorePosts(),
    loadingPosts = ref(true),
    initial = storeProfile.profileInfo?.username?.charAt(0).toUpperCase();

const modalActive = ref(false),
    selectedPost = ref<Post['id']>('');

const handleShowModal = (postId: Post['id']) => {
    modalActive.value = true;
    selectedPost.value = postId;
};

const onPostLoad = async (index: number, done: (stop?: boolean) => void) => {
    await storePosts.loadMore();

    done(!storePosts.hasMore);
};

onMounted(async () => {
    try {
        await storeProfile.loadUserInfo();
        await storePosts.loadPosts();
    } catch (error) {
        console.error(handleError(error));
    } finally {
        loadingPosts.value = false;
    }
});
</script>

<template>
    <q-page class="dashboard">
        <div v-if="loadingPosts" class="dashboard__loading">
            <q-spinner-dots color="primary" size="4rem" />
            <div class="dashboard__loading-text">loading your moments...</div>
        </div>

        <div
            v-else
            class="dashboard__container"
            :class="{ 'dashboard__container--centered': storePosts.posts.length === 0 }">
            <section class="dashboard__content">
                <div v-if="storePosts.posts.length <= 0" class="dashboard__empty">
                    <ProfileCard />
                </div>

                <div v-else>
                    <q-infinite-scroll :offset="250" @load="onPostLoad">
                        <PostCard
                            v-for="post in storePosts.posts"
                            :key="post.id"
                            :initial="initial"
                            :post="post"
                            @show-modal="handleShowModal" />

                        <template #loading>
                            <div class="row justify-center q-my-md">
                                <q-spinner-dots color="primary" size="2.5rem" />
                            </div>
                        </template>
                    </q-infinite-scroll>
                </div>
            </section>

            <aside v-if="storePosts.posts.length > 0" class="dashboard__sidebar">
                <ProfileCard />
            </aside>
        </div>

        <PostModal v-model="modalActive" @delete-post="storePosts.deletePost(selectedPost)" />
    </q-page>
</template>

<style lang="scss" scoped>
.dashboard {
    display: flex;
    justify-content: center;
    min-height: calc(100vh - 4rem);
    padding: 3rem 1rem;

    &__loading {
        align-self: center;
        margin-top: -4rem;
        text-align: center;

        &-text {
            margin-top: 1rem;
            font-size: 1.25rem;
            color: #9e9e9e;
        }
    }

    &__container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        max-width: 75rem;
        width: 100%;
        gap: 4rem;

        &--centered {
            align-self: center;
            padding: 0;
            margin-top: -4rem;
        }
    }

    &__content {
        flex: 1;
        max-width: 40rem;
    }

    &__empty {
        max-width: 32rem;
        width: 100%;
        margin: 0 auto;
    }

    &__sidebar {
        position: sticky;
        top: 7rem;
        flex-shrink: 0;
        width: 20rem;

        @media (width <= 55rem) {
            display: none;
        }
    }
}
</style>
