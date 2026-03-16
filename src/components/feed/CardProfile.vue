<script setup lang="ts">
import ItemAvatar from 'components/feed/ItemAvatar.vue';
import { useStoreProfile } from 'stores/profile.store';
import ButtonActive from 'components/common/ButtonActive.vue';
import ItemUserInfo from 'components/feed/ItemUserInfo.vue';

withDefaults(
    defineProps<{
        initial?: string | undefined;
    }>(),
    { initial: '' },
);

const storeProfile = useStoreProfile();
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar__content">
            <ItemAvatar
                v-if="storeProfile.profileInfo && storeProfile.profileInfo.avatarUrl"
                :avatar-src="storeProfile.profileInfo.avatarUrl"
                :initial="initial"
            />
            <q-skeleton v-else width="80px" height="80px" class="rounded-full" />

            <ItemUserInfo v-if="storeProfile.profileInfo" />

            <ButtonActive
                class="q-mt-sm"
                flat
                no-caps
                label="Create Post"
                :to="{ name: 'camera-page' }"
            />
        </div>
    </aside>
</template>

<style lang="scss" scoped>
@use 'src/css/custom.variables.scss' as *;

.sidebar {
    flex: 0 0 22rem;
    position: sticky;
    top: 6rem;

    &__content {
        align-items: center;
        backdrop-filter: blur(18px);
        background-color: $color-bg;
        border: 1px solid $color-border;
        border-radius: 1.75rem;
        box-shadow: 0 30px 100px rgb(0 0 0 / 90%);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.5em;
        text-align: center;
        width: 100%;
    }
}
</style>
