<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false
});

// Default board page desc - will be overwritten later
const MUSIC_DESC = 'Unified music playlist';

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Music',
    ogTitle: 'Hellomouse Music',
    description: MUSIC_DESC,
    ogDescription: MUSIC_DESC,
    ogImage: '/logos/meta/music.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <NuxtLayout name="music">
        <div class="d-flex">
            <!-- Your playlists on the left -->
            <div class="playlist-list mr-3">
                <v-btn
                    height="45"
                    block color="red"
                    prepend-icon="mdi-plus"
                >New Playlist</v-btn>

                <v-label class="mt-4 mb-1"><small>MY PLAYLISTS</small></v-label>

                <div style="max-height: calc(100vh - 170px); overflow-y: auto">
                    <div
                        v-for="n in 100"
                        class="hoverable hover-list-item playlist-list__list-item [ pl-2 text-truncate ]"
                        :key="n"
                    >
                        <v-icon icon="mdi-playlist-play" /> Item {{n}}
                    </div>
                </div>
            </div>

            <div style="width: 100%">
                <!-- Main video player -->
                <video class="video"></video>

                <!-- Desc / meta below player -->
                <div class="meta-container px-4 pt-1">
                    <div class="d-flex">
                        <h1 class="text-truncate mr-10">Title of Video</h1>
                        <v-spacer />

                        <v-tabs
                            v-model="tab"
                            class="small-tabs"
                            align-tabs="right"
                        >
                            <v-tab :value="1">Description</v-tab>
                            <v-tab :value="2">Lyrics</v-tab>
                        </v-tabs>
                    </div>
                        
                    <v-window v-model="tab">
                        <v-window-item :value="1" class="pt-1">
                            <p>Description of video</p>
                        </v-window-item>
                        <v-window-item :value="2" class="pt-1">
                            <p>Description of video 2</p>
                        </v-window-item>
                    </v-window>
                </div>
            </div>

            <!-- Song list on right -->
            <div class="song-list">
                <div class="song-list__header">
                    <div class="pt-4 px-4">
                        <p class="playlist-name">Playlist Name</p>
                        <p class="playlist-song-count">n songs</p>
                    </div>

                    <div class="d-flex">
                        <v-spacer />

                        <v-tooltip text="Shuffle" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-shuffle"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Repeat" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-repeat"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Add to Playlists" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-playlist-plus"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Edit Playlist" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-playlist-edit"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Share Playlist" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-account-plus"></v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </div>

                <v-list lines="one" class="song-list__list">
                    <v-list-item
                        v-for="n in 100"
                        :key="n"
                        class="list-item-no-round-avatar"
                        prepend-avatar="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                        :title="'Item ' + n"
                        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
                    ></v-list-item>
                </v-list>
            </div>
        </div>
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';

export default {
    data() {
        return {
            tab: 1
        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
    },
    watch: {
        '$route.query'() {
            if (this.$route.path === '/music') {

            }
        },
    },
    mounted() {

    },
    destroyed() {

    },
    // Get boards on page first load
    created() {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/state.scss";

.playlist-list {
    min-width: 200px;

    &__list-item {
        cursor: pointer;
        height: $menu-item-height;
        line-height: $menu-item-height;
        user-select: none;
    }
}

.video {
    width: 100%;
    height: 420px;
    background: black;
}

.meta-container {
    & > h1 {
        border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    .small-tabs {
        transform: scale(0.75);
        transform-origin: top left;
    }
}

.song-list {
    min-width: 250px;
    box-sizing: border-box;

    &__header {
        background-color: rgba(var(--v-theme-on-surface), var(--v-activated-opacity));

        .playlist-name {
            color: rgb(var(--v-theme-on-surface));
            font-size: 1.15rem;
        }
        .playlist-song-count {
            opacity: var(--v-medium-emphasis-opacity);
            font-size: 0.85rem;
        }
    }

    &__list {
        height: calc(100vh - 180px);
    }
}
</style>

<style lang="scss">
// Make the playlist thumbnails not round, we're using
// the v-list avatars
.list-item-no-round-avatar .v-avatar {
    border-radius: 0 !important;
}
</style>