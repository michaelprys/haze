<script setup lang="ts">
import ProfileUserInfo from 'components/profile/ProfileUserInfo.vue';
import ProfileAvatar from 'components/profile/ProfileAvatar.vue';
import BaseButton from 'components/base/BaseButton.vue';
import { useStoreProfile } from 'stores/profile.store';

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
            <q-skeleton
                v-if="storeProfile.isLoading"
                width="80px"
                height="80px"
                class="rounded-full" />
            <ProfileAvatar
                v-else
                :avatar-src="storeProfile.profileInfo?.avatarUrl"
                :initial="initial" />

            <ProfileUserInfo v-if="storeProfile.profileInfo" />

            <BaseButton
                class="q-mt-sm"
                flat
                no-caps
                label="Create Post"
                :to="{ name: 'camera-page' }" />
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
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 1.5em;
        box-shadow: 0 30px 100px rgb(0 0 0 / 90%);
        backdrop-filter: blur(18px);
        text-align: center;
        background-color: $color-bg;
        border: 1px solid $color-border;
        border-radius: 1.75rem;
    }
}
</style>
