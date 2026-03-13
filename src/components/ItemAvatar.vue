<script setup lang="ts">
import { useStoreProfile } from 'stores/profile.store'

const storeProfile = useStoreProfile()

defineProps<{
    avatarSrc: string | null | undefined
}>()

const emit = defineEmits<{ (e: 'update-avatar', file: File): void }>()

const onFileChange = (value: File | File[] | null) => {
    const file = Array.isArray(value) ? value[0] : value
    if (!file) return
    emit('update-avatar', file)
}

const initial = storeProfile.profileInfo?.username?.charAt(0)
</script>

<template>
    <div class="avatar-wrapper">
        <q-avatar class="avatar" size="90px">
            <q-img v-if="avatarSrc" :src="avatarSrc" fit="cover" style="width: 100%; height: 100%">
                <template #loading>
                    <q-skeleton type="QAvatar" width="100%" height="100%" />
                </template>

                <template #error>
                    <div class="avatar-placeholder">
                        {{ initial }}
                        <q-icon v-if="!initial" name="person" size="32" />
                    </div>
                </template>
            </q-img>

            <div v-else class="avatar-placeholder">
                {{ initial }} <q-icon v-if="!initial" name="person" size="32" />
            </div>
        </q-avatar>

        <q-file
            :model-value="null"
            @update:model-value="onFileChange"
            borderless
            dense
            no-thumbnails
            class="avatar-overlay"
        >
            <q-icon name="edit" class="overlay-icon" />
        </q-file>
    </div>
</template>

<style lang="sass" scoped>
.avatar-wrapper
    position: relative
    border-radius: 50%
    width: 8rem
    height: 8rem

.avatar
    position: absolute
    top: 50%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    width: 100%
    height: 100%

.avatar-overlay
    position: absolute
    inset: 0
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    background: linear-gradient(135deg, rgba(255,160,140,0.65) 0%, rgba(255,120,100,0.65) 50%, rgba(220,80,60,0.65) 100%)
    opacity: 0
    transition: opacity .3s ease
    cursor: pointer

.overlay-icon
    right: -1.5rem
    font-size: 1.625rem
    color: white
    filter: drop-shadow(0 0 0.4375rem #ffaa60)
    transform: scale(0.85)
    transition: all .25s ease
    cursor: pointer

.avatar-wrapper:hover .avatar-overlay
    opacity: 1

.avatar-wrapper:hover .overlay-icon
    transform: scale(1.1)

.avatar-placeholder
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    height: 100%
    border-radius: 50%
    background: linear-gradient(145deg, #fce8e0 0%, #f9d6c2 40%, #f5bfa0 70%, #f0a67f 100%)
    box-shadow: 0 0 1rem rgba(250,210,180,0.3), 0 0 0.15rem rgba(240,200,160,0.15) inset
    color: #7a5c44
    font-weight: 700
    font-size: 2rem
    text-shadow: 0 0 0.3rem rgba(250,210,190,0.5), 0 0 0.6rem rgba(240,200,170,0.25)
    line-height: 1
</style>
