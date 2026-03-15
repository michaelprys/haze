<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreProfile } from 'stores/profile.store';
import handleError from 'src/utils/handleError.utils';

defineProps<{
    avatarSrc: string | null | undefined;
}>();

const emit = defineEmits<{ (e: 'update-avatar', file: File): void }>();

const storeProfile = useStoreProfile();
const $q = useQuasar();

const isUploading = ref(false);

const initial = computed(() => {
    return storeProfile.profileInfo?.username?.charAt(0).toUpperCase() || '?';
});

const handleFileChange = async (file: File | null) => {
    if (!file) return;

    isUploading.value = true;
    try {
        await storeProfile.updateAvatar(file);
        emit('update-avatar', file);
        $q.notify({
            type: 'positive',
            message: 'Updated',
            timeout: 800,
        });
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: handleError(error) ?? 'Error',
        });
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="user-avatar">
        <div class="user-avatar__wrapper">
            <q-avatar class="user-avatar__content">
                <q-img v-if="avatarSrc" :src="avatarSrc" class="user-avatar__img" fit="cover">
                    <template #loading>
                        <q-skeleton type="QAvatar" class="full-height full-width" />
                    </template>
                </q-img>

                <div v-else class="user-avatar__placeholder">
                    {{ initial }}
                </div>

                <div v-if="isUploading" class="user-avatar__loading">
                    <q-spinner-soft color="white" size="30px" />
                </div>
            </q-avatar>

            <div class="user-avatar__overlay">
                <q-icon name="photo_camera" class="user-avatar__icon" />
            </div>

            <q-file
                class="user-avatar__input"
                :model-value="null"
                borderless
                dense
                @update:model-value="handleFileChange"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-avatar {
    display: flex;
    justify-content: center;

    &__wrapper {
        position: relative;
        width: 7.5rem;
        height: 7.5rem;
        border-radius: 50%;
        overflow: hidden;

        &:hover {
            .user-avatar__overlay {
                opacity: 1;
            }
            .user-avatar__icon {
                transform: translateY(0);
            }
        }
    }

    &__content {
        background: #2a2a2a;
        width: 100%;
        height: 100%;
    }

    &__img {
        width: 100%;
        height: 100%;
    }

    &__placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(145deg, #444, #222);
        color: #ffe8c0;
        font-size: 2.2rem;
        font-weight: 600;
    }

    &__loading {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }

    &__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.25s ease;
        z-index: 1;
        pointer-events: none;
    }

    &__icon {
        color: #fff;
        font-size: 26px;
        transform: translateY(6px);
        transition: transform 0.25s ease;
    }

    &__input {
        position: absolute;
        inset: 0;
        z-index: 3;
        cursor: pointer;
        opacity: 0;

        :deep(.q-field__control),
        :deep(.q-field__native),
        :deep(.q-field__inner) {
            height: 100% !important;
            width: 100% !important;
            min-height: 100% !important;
        }
    }
}
</style>
```
