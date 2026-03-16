<script setup lang="ts">
import type { QInput } from 'quasar';
import { useQuasar } from 'quasar';
import handleError from 'src/utils/handleError.utils';
import { useStoreProfile } from 'stores/profile.store';
import { nextTick, ref, watch } from 'vue';

const storeProfile = useStoreProfile();
const $q = useQuasar();

const isEditing = ref({ username: false, bio: false });
const loading = ref({ username: false, bio: false });

const fields = ref({
    username: storeProfile.profileInfo?.username ?? 'User',
    bio: storeProfile.profileInfo?.bio ?? '',
});

const usernameInput = ref<QInput | null>(null);
const bioInput = ref<QInput | null>(null);

const startEdit = async (field: 'username' | 'bio') => {
    isEditing.value[field] = true;
    await nextTick();
    if (field === 'username') usernameInput.value?.focus();
    if (field === 'bio') bioInput.value?.focus();
};

const handleUpdateUsername = async () => {
    const oldValue = storeProfile.profileInfo?.username ?? 'User';
    const newValue = fields.value.username.trim();
    if (!newValue || newValue === oldValue) {
        fields.value.username = oldValue;
        isEditing.value.username = false;
        return;
    }
    loading.value.username = true;
    try {
        await storeProfile.updateUsername(newValue);
        $q.notify({ type: 'positive', message: 'Updated', timeout: 800 });
    } catch (e) {
        fields.value.username = oldValue;
        $q.notify({ type: 'negative', message: handleError(e) ?? 'Error' });
    } finally {
        loading.value.username = false;
        isEditing.value.username = false;
    }
};

const handleUpdateBio = async () => {
    const oldValue = storeProfile.profileInfo?.bio ?? '';
    const newValue = fields.value.bio.trim().slice(0, 120);
    if (newValue === oldValue) {
        fields.value.bio = oldValue;
        isEditing.value.bio = false;
        return;
    }
    loading.value.bio = true;
    try {
        await storeProfile.updateBio(newValue);
        $q.notify({ type: 'positive', message: 'Updated', timeout: 800 });
    } catch (e) {
        fields.value.bio = oldValue;
        $q.notify({ type: 'negative', message: handleError(e) ?? 'Error' });
    } finally {
        loading.value.bio = false;
        isEditing.value.bio = false;
    }
};

watch(
    () => storeProfile.profileInfo,
    (newVal) => {
        fields.value.username = newVal?.username ?? 'User';
        fields.value.bio = newVal?.bio ?? '';
    },
);
</script>

<template>
    <div class="profile-info">
        <div class="profile-info__content">
            <div
                class="profile-info__field"
                :class="{ 'profile-info__field--editing': isEditing.username }"
                @click="!isEditing.username && startEdit('username')"
            >
                <div v-if="!isEditing.username" class="profile-info__display">
                    <span class="profile-info__text profile-info__text--username">
                        {{ fields.username }}
                    </span>
                </div>
                <q-input
                    v-else
                    ref="usernameInput"
                    v-model="fields.username"
                    dense
                    borderless
                    maxlength="20"
                    :loading="loading.username"
                    class="profile-info__input profile-info__input--username"
                    @blur="handleUpdateUsername"
                    @keyup.enter="handleUpdateUsername"
                    @keyup.esc="isEditing.username = false"
                />
            </div>

            <div
                class="profile-info__field"
                :class="{ 'profile-info__field--editing': isEditing.bio }"
                @click="!isEditing.bio && startEdit('bio')"
            >
                <div v-if="!isEditing.bio" class="profile-info__display">
                    <span
                        class="profile-info__text profile-info__text--bio"
                        :class="{ 'profile-info__text--empty': !fields.bio }"
                    >
                        {{ fields.bio || 'Add a bio' }}
                    </span>
                </div>
                <q-input
                    v-else
                    ref="bioInput"
                    v-model="fields.bio"
                    dense
                    borderless
                    autogrow
                    maxlength="120"
                    :loading="loading.bio"
                    class="profile-info__input profile-info__input--bio"
                    @blur="handleUpdateBio"
                    @keyup.enter="handleUpdateBio"
                    @keyup.esc="isEditing.bio = false"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-info {
    display: flex;
    justify-content: center;
    width: 100%;

    &__content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 240px;
        width: 100%;
    }

    &__field {
        border: 1px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        overflow: hidden;
        padding: 6px 10px;
        transition: background 0.2s ease;
        width: 100%;

        &:hover:not(&--editing) {
            background: rgb(255 255 255 / 4%);
        }

        &--editing {
            background: rgb(255 160 50 / 6%);
            border-color: rgb(255 160 50 / 10%);
            cursor: default;
        }
    }

    &__display {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    &__text {
        display: block;
        line-height: 1.3;
        text-align: center;
        width: 100%;

        &--username {
            color: #ffe8c0;
            font-size: 1.15rem;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &--bio {
            color: #c8a070;
            font-size: 0.85rem;
            font-weight: 300;
            overflow-wrap: anywhere;
        }

        &--empty {
            font-style: italic;
            opacity: 0.4;
        }
    }

    &__input {
        width: 100%;

        &--username {
            margin-top: 0.5rem;
            color: #ffe8c0;
            font-size: 1.15rem;
            font-weight: 600;
        }

        &--bio {
            color: #c8a070;
            font-size: 0.85rem;
            font-weight: 300;
        }

        :deep(.q-field__control) {
            background: transparent !important;
            height: auto;
            min-height: unset;

            &::before,
            &::after {
                display: none;
            }
        }

        :deep(.q-field__native) {
            color: inherit;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            line-height: 1.3;
            padding: 0;
            text-align: center;
        }

        :deep(.q-field__append) {
            display: none;
        }
    }
}
</style>
