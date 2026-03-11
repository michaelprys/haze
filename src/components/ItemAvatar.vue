<script setup lang="ts">
defineProps<{
    avatarSrc: string
}>()

const emit = defineEmits<{ (e: 'update-avatar', file: File): void }>()

const onFileChange = (files?: File[]) => {
    if (!files || files.length === 0 || !files[0]) return
    const file: File = files[0]
    emit('update-avatar', file)
}
</script>

<template>
    <div class="avatar-wrapper">
        <q-avatar class="avatar" size="90px">
            <q-img :src="avatarSrc" fit="cover" style="width: 100%; height: 100%">
                <template #loading>
                    <q-skeleton type="QAvatar" width="100%" height="100%" />
                </template>
            </q-img>
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
    display: inline-block
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
    background: linear-gradient(135deg, rgba(255,150,50,0.42), rgba(255,110,40,0.42), rgba(255,140,0,0.35))
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
</style>
