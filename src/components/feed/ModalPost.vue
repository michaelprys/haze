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
        <q-btn flat label="keep it" class="delete-modal__button delete-modal__button--cancel" v-close-popup />
        <q-btn
          flat
          label="delete"
          class="delete-modal__button delete-modal__button--confirm"
          v-close-popup
          @click="emit('deletePost')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.delete-modal {
  background-color: #070707 !important;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 2rem !important;
  box-shadow: 0 1.5625rem 3.125rem rgb(0 0 0 / 50%);
  min-width: 17.5rem;
  padding: 1.5rem;

  &__content {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  &__icon {
    background: rgb(255 255 255 / 3%);
    border: 1px solid rgb(255 255 255 / 5%);
    border-radius: 50%;
    color: rgb(255 255 255 / 20%);
    display: grid;
    font-family: serif;
    font-size: 1.2rem;
    font-style: italic;
    height: 2.5rem;
    margin-bottom: 1rem;
    place-items: center;
    width: 2.5rem;
  }

  &__text {
    color: #eee;
    font-size: 0.95rem;
    font-weight: 300;
    letter-spacing: 0.02em;
    text-align: center;
  }

  &__actions {
    gap: 0.5rem;
    padding-bottom: 1rem;
  }

  &__button {
    border-radius: 6.25rem;
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    padding: 0.25rem 1rem;
    text-transform: lowercase;
    transition: all 0.3s ease;

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
        background: rgb(255 77 79 / 8%);
        transform: translateY(-0.0625rem);
      }
    }
  }
}
</style>
