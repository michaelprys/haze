<script setup lang="ts">
import PostCard from 'components/post/PostCard.vue';
import PostModal from 'components/post/PostModal.vue';
import ProfileCard from 'components/profile/ProfileCard.vue';
import { useStorePosts } from 'src/stores/posts.store';
import type { Post } from 'src/types/post.types';
import handleError from 'src/utils/handleError.utils';
import { useStoreProfile } from 'stores/profile.store';
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
    <q-page class="dashboard q-pa-md">
        <div v-if="loadingPosts" class="dashboard__loading">
            <q-spinner-dots color="orange" size="4rem" />
            <div class="dashboard__loading-text">loading your moments...</div>
        </div>

        <div v-else class="dashboard__container">
            <section class="dashboard__content">
                <div v-if="storePosts.posts.length <= 0" class="dashboard__empty">
                    <ProfileCard />
                </div>

                <div v-else>
                    <q-infinite-scroll @load="onPostLoad" :offset="250">
                        <PostCard
                            v-for="post in storePosts.posts"
                            :key="post.id"
                            :post="post"
                            :initial="initial"
                            @show-modal="handleShowModal" />

                        <template #loading>
                            <div class="row justify-center q-my-md">
                                <q-spinner-dots color="primary" size="40px" />
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
    display: grid;
    place-items: center;

    &__loading {
        text-align: center;
        margin: 5rem 0;

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
        top: 6rem;
        flex-shrink: 0;
        width: 20rem;

        @media (width <= 55rem) {
            display: none;
        }
    }
}
</style>
