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
            <div class="playlist-list mr-2">
                <v-btn
                    height="45"
                    block color="red"
                    prepend-icon="mdi-plus"

                    @click="[currentPlaylistId, editPlaylistModal] = ['', true]"
                >New Playlist</v-btn>

                <v-label class="mt-4 ml-2 mb-1"><small>MY PLAYLISTS</small></v-label>

                <div style="max-height: calc(100vh - 180px); overflow-y: auto">
                    <NuxtLink
                        v-for="playlist in playlists"
                        :key="playlist.id"
                        :to="'/music?playlistId=' + playlist.id"
                        class="hoverable hover-list-item playlist-list__list-item [ pl-2 text-truncate ]"
                    >
                        <v-icon icon="mdi-playlist-play" /> {{ playlist.name }}
                    </NuxtLink>
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
                        <p class="playlist-name text-truncate">{{ loadedPlaylist.name }}</p>
                        <p class="playlist-song-count text-truncate">{{ loadedPlaylist.song_count }} songs</p>
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

                        <v-tooltip
                            v-if="!isOwnPlaylist"
                            :text="loadedPlaylist.is_in_userlist ? 'Remove from Playlists' : 'Add to Playlists'"
                            location="top"
                        >
                            <template #activator="{ props }">
                                <v-btn
                                    variant="text" size="small" v-bind="props"
                                    :icon="loadedPlaylist.is_in_userlist ? 'mdi-playlist-remove' : 'mdi-playlist-plus'"
                                    @click="toggleInPlaylists"
                                ></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Edit Playlist" location="top">
                            <template v-if="isOwnPlaylist" #activator="{ props }">
                                <v-btn
                                    variant="text" size="small" v-bind="props" icon="mdi-playlist-edit"
                                    @click="[currentPlaylistId, editPlaylistModal] = [playlistId, true]"
                                ></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Share Playlist" location="top">
                            <template #activator="{ props }">
                                <v-btn variant="text" size="small" v-bind="props" icon="mdi-account-plus"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip v-if="isOwnPlaylist" text="Delete Playlist" location="top">
                            <template #activator="{ props }">
                                <v-btn
                                    variant="text" size="small" v-bind="props" icon="mdi-playlist-remove"
                                    @click="deletePlaylistModal = true"
                                ></v-btn>
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

            <v-snackbar
                v-model="showErrorToast" color="error" rounded="0" theme="dark"
                transition="scroll-y-reverse-transition"
            >
                {{ toastErrorMsg }}
            </v-snackbar>
            <v-snackbar
                v-model="showSuccessToast" color="success"
                rounded="0" theme="dark" timeout="2000"
                transition="scroll-y-reverse-transition"
            >
                {{ toastSuccessMsg }}
            </v-snackbar>

            <music-playlist-modal
                :show="editPlaylistModal"
                :playlist-id="currentPlaylistId"
                :initial-name="currentPlaylistId ? loadedPlaylist.name : ''"

                @update="createEditPlaylistUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <music-delete-playlist-modal
                :show="deletePlaylistModal"
                :playlist-id="playlistId"
                :playlist-name="playlistIdNameMap[playlistId] || ''"

                @update="onPlaylistUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />
        </div>
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { useMusicStore } from '~/store/musicStore.js';

export default {
    data() {
        return {
            tab: 1,
            playlists: [],
            loadedPlaylist: {},
            playlistIdNameMap: {}, // Id -> name

            currentPlaylistId: '',
            editPlaylistModal: false,
            deletePlaylistModal: false,

            // Toasts
            showErrorToast: false,
            showSuccessToast: false,
            toastErrorMsg: '',
            toastSuccessMsg: '',
        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
        playlistId() { return this.$route.query.playlistId; },
        isOwnPlaylist() {
            return this.loadedPlaylist && this.loadedPlaylist.creator_id === this.user.id;
        }
    },
    watch: {
        '$route.query'() {
            if (this.$route.path === '/music') {
                console.log(this.$route.query);
                this.getCurrentPlaylist();
            }
        },
    },
    mounted() {
        
    },
    destroyed() {

    },
    // Get playlists on page first load
    created() {
        this.updatePlaylists();
        this.getCurrentPlaylist();
    },
    methods: {
        // Get metadata of current playlist
        async getCurrentPlaylist() {
            if (!useAuthStore(this.$pinia).isLoggedIn || !this.playlistId) return;

            try {
                let playlist = await this.$fetchApi('/api/music/playlist/single', 'GET', { id: this.playlistId });
                this.loadedPlaylist = playlist.playlist || {};
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get playlist: ' + this.$apiErrorToString(e);
            }
        },
        // Fetch playlists
        async updatePlaylists() {
            if (!useAuthStore(this.$pinia).isLoggedIn) {
                this.playlists = [];
                return;
            }

            const musicStore = useMusicStore(this.$pinia);
            if (Date.now() < musicStore.lastFetch + 60 * 1000 && musicStore.playlists.length) {
                this.playlists = musicStore.playlists;
                return;
            }

            try {
                let playlists = await this.$fetchApi('/api/music/playlist', 'GET', {});
                this.playlists = playlists.playlists;
                musicStore.playlists = [...this.playlists];

                for (let playlist of this.playlists)
                    this.playlistIdNameMap[playlist.id] = playlist.name;
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get playlists: ' + this.$apiErrorToString(e);
            }
        },
        // When playlist is added or edited
        createEditPlaylistUpdate(opts) {
            this.editPlaylistModal = false;
            if (opts === false) return;
            if (!opts.wasEdit) {
                this.playlists.push({ id: opts.id, name: opts.name });
                this.$router.push({ path: '/music', query: { playlistId: opts.id } });
            }
            else {
                for (let playlist of this.playlists) {
                    if (playlist.id === opts.id) {
                        playlist.name = opts.name;
                        break;
                    }
                }
            }
            this.playlistIdNameMap[opts.id] = opts.name;
            this.playlists.sort((a, b) => b.name > a.name ? -1 : 1);
            useMusicStore(this.$pinia).playlists = [...this.playlists];
        },
        // Playlist deletion
        onPlaylistUpdate(up) {
            if (up.type === 'playlist_delete') {
                delete this.playlistIdNameMap[up.id];
                this.playlists = this.playlists.filter(p => p.id !== up.id);

                if (this.playlists[0])
                    this.$router.push({path: '/music', query: { playlistId: this.playlists[0].id }});
            } else if (up.type === 'close_playlist_delete')
                this.deletePlaylistModal = false;
        },
        // Toggle in playlists
        async toggleInPlaylists() {
            if (!this.loadedPlaylist) return;
            let newState = !this.loadedPlaylist.is_in_userlist;

            try {
                await this.$fetchApi('/api/music/user_playlist', newState ? 'POST' : 'DELETE',
                    { id: this.loadedPlaylist.id });

                if (newState) { // Added
                    this.playlists.push({ id: this.loadedPlaylist.id, name: this.loadedPlaylist.name });
                    this.playlistIdNameMap[this.loadedPlaylist.id] = this.loadedPlaylist.name;
                    this.playlists.sort((a, b) => b.name > a.name ? -1 : 1);
                } else { // Deleted
                    delete this.playlistIdNameMap[this.loadedPlaylist.id];
                    this.playlists = this.playlists.filter(p => p.id !== this.loadedPlaylist.id);
                }
                useMusicStore(this.$pinia).playlists = [...this.playlists];

                this.loadedPlaylist.is_in_userlist = newState;
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to add / remove from playlists: ' + this.$apiErrorToString(e);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/state.scss";

.playlist-list {
    min-width: 220px;
    max-width: 220px;

    &__list-item {
        cursor: pointer;
        height: $menu-item-height;
        line-height: $menu-item-height;
        user-select: none;

        color: rgb(var(--v-theme-on-surface));
        text-decoration: none;
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
    max-width: 250px;
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