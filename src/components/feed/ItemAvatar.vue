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
                    <q-spinner color="white" size="30px" />
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
        border-radius: 50%;
        height: 7.5rem;
        overflow: hidden;
        position: relative;
        width: 7.5rem;

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
        height: 100%;
        width: 100%;
    }

    &__img {
        height: 100%;
        width: 100%;
    }

    &__placeholder {
        align-items: center;
        background: linear-gradient(145deg, #444, #222);
        color: #ffe8c0;
        display: flex;
        font-size: 2.2rem;
        font-weight: 600;
        height: 100%;
        justify-content: center;
        width: 100%;
    }

    &__loading {
        align-items: center;
        background: rgb(0 0 0 / 50%);
        display: flex;
        inset: 0;
        justify-content: center;
        position: absolute;
        z-index: 2;
    }

    &__overlay {
        align-items: center;
        background: rgb(0 0 0 / 45%);
        display: flex;
        inset: 0;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        transition: opacity 0.25s ease;
        z-index: 1;
    }

    &__icon {
        color: #fff;
        font-size: 26px;
        transform: translateY(6px);
        transition: transform 0.25s ease;
    }

    &__input {
        cursor: pointer;
        inset: 0;
        opacity: 0;
        position: absolute;
        z-index: 3;

        :deep(.q-field__control),
        :deep(.q-field__native),
        :deep(.q-field__inner) {
            height: 100% !important;
            min-height: 100% !important;
            width: 100% !important;
        }
    }
}
</style>
```
