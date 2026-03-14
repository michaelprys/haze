<script setup lang="ts">
import { useStoreProfile } from 'stores/profile.store';

const storeProfile = useStoreProfile();

defineProps<{
    avatarSrc: string | null | undefined;
}>();

const emit = defineEmits<{ (e: 'update-avatar', file: File): void }>();

const onFileChange = (value: File | File[] | null) => {
    const file = Array.isArray(value) ? value[0] : value;
    if (!file) return;
    emit('update-avatar', file);
};

const initial = storeProfile.profileInfo?.username?.charAt(0);
</script>

<template>
    <div class="avatar">
        <q-avatar class="avatar__wrapper" size="90px">
            <q-img v-if="avatarSrc" class="avatar__img" fit="cover" :src="avatarSrc">
                <template #loading>
                    <q-skeleton height="100%" type="QAvatar" width="100%" />
                </template>

                <template #error>
                    <div class="avatar__placeholder">
                        {{ initial }}
                        <q-icon v-if="!initial" name="person" size="32" />
                    </div>
                </template>
            </q-img>

            <div v-else class="avatar__placeholder">
                {{ initial }} <q-icon v-if="!initial" name="person" size="32" />
            </div>
        </q-avatar>

        <q-file
            borderless
            class="avatar__overlay"
            dense
            :model-value="null"
            no-thumbnails
            @update:model-value="onFileChange"
        >
            <q-icon class="avatar__overlay-icon" name="edit" />
        </q-file>
    </div>
</template>

<style lang="scss" scoped>
.avatar {
    border-radius: 50%;
    height: 8rem;
    position: relative;
    width: 8rem;

    &__wrapper {
        height: 100%;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
    }

    &__img {
        height: 100%;
        width: 100%;
    }

    &__overlay {
        align-items: center;
        background: linear-gradient(
            135deg,
            rgb(255 160 140 / 65%) 0%,
            rgb(255 120 100 / 65%) 50%,
            rgb(220 80 60 / 65%) 100%
        );
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        inset: 0;
        justify-content: center;
        opacity: 0;
        position: absolute;
        transition: opacity 0.3s ease;

        &:hover {
            opacity: 1;
        }
    }

    &__overlay-icon {
        color: white;
        cursor: pointer;
        filter: drop-shadow(0 0 0.4375rem #ffaa60);
        font-size: 1.625rem;
        right: -1.5rem;
        transform: scale(0.85);
        transition: all 0.25s ease;
    }

    &__placeholder {
        align-items: center;
        background: linear-gradient(145deg, #fce8e0 0%, #f9d6c2 40%, #f5bfa0 70%, #f0a67f 100%);
        border-radius: 50%;
        box-shadow:
            0 0 1rem rgb(250 210 180 / 30%),
            0 0 0.15rem rgb(240 200 160 / 15%) inset;
        color: #7a5c44;
        display: flex;
        font-size: 2rem;
        font-weight: 700;
        height: 100%;
        justify-content: center;
        line-height: 1;
        text-shadow:
            0 0 0.3rem rgb(250 210 190 / 50%),
            0 0 0.6rem rgb(240 200 170 / 25%);
        width: 100%;
    }

    &:hover {
        &__overlay {
            opacity: 1;
        }

        &__overlay-icon {
            transform: scale(1.1);
        }
    }
}
</style>
