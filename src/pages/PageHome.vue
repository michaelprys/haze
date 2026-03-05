<script setup lang="ts">
import { date } from 'quasar'

const posts = [
    {
        id: 1,
        caption: 'Golden Gate Bridge',
        date: 1772543224326,
        location: 'San Diego, United States',
        imageUrl: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
    {
        id: 2,
        caption: 'Golden Gate Bridge',
        date: 1772543224326,
        location: 'San Diego, United States',
        imageUrl: 'https://cdn.quasar.dev/img/boy-avatar.png',
    },
]

const formattedDate = (value: number) => {
    return date.formatDate(value, 'MMMM D, h:mm A')
}
</script>

<template>
    <q-page class="feed-page flex flex-center q-pa-md">
        <div class="feed-container">
            <q-card v-for="post in posts" :key="post.id" class="post-card q-mb-lg" flat bordered>
                <q-item>
                    <q-item-section avatar>
                        <q-avatar size="48px">
                            <q-img :src="post.imageUrl" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="username">MichaelPrys</q-item-label>
                        <q-item-label caption class="caption">
                            {{ post.caption }}
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator />

                <q-img class="post-image" src="https://unsplash.it/600" />

                <q-card-section>
                    <div class="location">
                        {{ post.location }}
                    </div>
                    <div class="date">
                        {{ formattedDate(post.date) }}
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<style lang="sass">
.feed-page
    min-height: 100vh

.feed-container
    width: 100%
    max-width: 37.5rem

.post-card
    background-color: #121212
    border-radius: 20px
    border: 1px solid rgba(255, 120, 0, 0.15)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6)

.post-image
    max-height: 25rem

.username
    font-weight: bold
    color: #ffffff

.caption
    color: #ff9a3c

.location
    color: #ff7a00
    font-size: 0.9rem

.date
    color: #777
    font-size: 0.75rem
    margin-top: 0.25rem
</style>
