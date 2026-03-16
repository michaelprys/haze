<script setup lang="ts">
import Logo from 'src/assets/logo.webp';

defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <q-page class="auth">
    <div class="auth__container">
      <div class="auth__header">
        <div class="auth__logo-wrapper">
          <img class="auth__logo" alt="Haze logo" height="1024" :src="Logo" width="1024" />
        </div>

        <div class="auth__title">{{ title }}</div>
        <div class="auth__subtitle">{{ subtitle }}</div>
      </div>

      <q-card bordered class="auth__card q-mt-lg" flat>
        <q-card-section>
          <slot name="form" />
        </q-card-section>
      </q-card>

      <div class="auth__footer q-mt-lg">
        <slot name="footer" />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.auth {
  display: grid;
  min-height: 100svh;
  place-items: center;

  &__container {
    max-width: 30rem;
    padding: 2rem;
    width: 100%;
  }

  &__header {
    text-align: center;
  }

  &__logo-wrapper {
    background: rgb(255 149 0 / 10%);
    border-radius: 1.25rem;
    box-shadow: 0 0 0.9375rem rgb(255 149 0 / 40%);
    display: inline-flex;
  }

  &__logo {
    height: 5rem;
    margin-left: 0.0625rem;
    margin-top: 0.3125rem;
    width: 5rem;
  }

  &__title {
    color: rgb(255 255 255 / 100%);
    font-size: 1.8rem;
    font-weight: 700;
  }

  &__subtitle {
    color: rgb(119 119 119 / 100%);
    font-size: 0.9rem;
  }

  &__card {
    background-color: rgb(18 18 18 / 100%);
    border: 1px solid rgb(255 120 0 / 15%);
    border-radius: 1.25rem;
    box-shadow: 0 0.9375rem 2.5rem rgb(0 0 0 / 60%);
    width: 100%;
  }

  &__footer {
    color: rgb(119 119 119 / 100%);
    font-size: 0.85rem;
    text-align: center;
  }

  :deep() {
    .auth-button {
      background: linear-gradient(135deg, #ff9500, #ff3a00);
      border-radius: 0.75rem;
      height: 2.75rem;
      letter-spacing: 0.03125rem;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background-position 2s ease;
      width: 100%;

      &:hover {
        box-shadow: 0 0.75rem 1.75rem rgb(255 80 0 / 50%);
      }
    }

    .auth-link {
      color: #ff9500;
      cursor: pointer;
      font-weight: 600;
      margin-left: 0.25rem;
      text-decoration: none;
      transition: 0.2s;

      &:hover {
        color: #ff3a00;
      }
    }

    .q-field__control {
      background: rgb(255 255 255 / 2%);
      border-radius: 0.75rem;
    }

    .q-field__label {
      color: #aaa;
    }
  }
}
</style>
