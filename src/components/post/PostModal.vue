<script setup lang="ts">
const emit = defineEmits(['deletePost']);
</script>

<template>
    <q-dialog backdrop-filter="blur(0.25rem)">
        <q-card class="delete-modal">
            <q-card-section class="delete-modal__content">
                <div class="delete-modal__icon">!</div>
                <div class="delete-modal__text">Delete this memory forever?</div>
            </q-card-section>

            <q-card-actions align="center" class="delete-modal__actions">
                <q-btn
                    flat
                    label="keep it"
                    class="delete-modal__button delete-modal__button--cancel"
                    v-close-popup />
                <q-btn
                    flat
                    label="delete"
                    class="delete-modal__button delete-modal__button--confirm"
                    v-close-popup
                    @click="emit('deletePost')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style lang="scss" scoped>
.delete-modal {
    min-width: 17.5rem;
    box-shadow: 0 1.5625rem 3.125rem rgb(0 0 0 / 50%);
    background-color: #070707 !important;
    padding: 1.5rem;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: 2rem !important;

    &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem 0;
    }

    &__icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        font-family: serif;
        font-size: 1.2rem;
        background: rgb(255 255 255 / 3%);
        color: rgb(255 255 255 / 20%);
        margin-bottom: 1rem;
        font-style: italic;
        border: 1px solid rgb(255 255 255 / 5%);
        border-radius: 50%;
    }

    &__text {
        font-size: 0.95rem;
        font-weight: 300;
        letter-spacing: 0.02em;
        color: #eee;
        text-align: center;
    }

    &__actions {
        gap: 0.5rem;
        padding-bottom: 1rem;
    }

    &__button {
        padding: 0.25rem 1rem;
        font-size: 0.85rem;
        font-weight: 400;
        letter-spacing: 0.05em;
        transition: all 0.3s ease;
        text-transform: lowercase;
        border-radius: 6.25rem;

        &--cancel {
            color: rgb(255 255 255 / 30%);

            &:hover {
                background: rgb(255 255 255 / 5%);
                color: #fff;
            }
        }

        &--confirm {
            color: #ff4d4f;

            &:hover {
                transform: translateY(-0.0625rem);
                background: rgb(255 77 79 / 8%);
            }
        }
    }
}
</style>
