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
        <div v-if="initialLoad" class="state-loader state-center">
            <v-progress-linear color="primary" indeterminate class="mb-2" />
            Loading Playlist...
        </div>

        <div v-if="errorState" class="state-center">
            <img src="/error-state.png" width="200">
            <h1>Could not get playlist</h1>
            <p class="mb-4">Playlist does not exist or you do not have permission to view</p>
        </div>

        <div class="d-flex">
            <!-- Your playlists on the left -->
            <div class="playlist-list mr-2">
                <v-btn
                    v-if="isLoggedIn"
                    height="45"
                    block color="red"
                    prepend-icon="mdi-plus"

                    @click="[currentPlaylistId, editPlaylistModal] = ['', true]"
                >New Playlist</v-btn>

                <v-label v-if="playlists.length > 0" class="mt-4 ml-2 mb-1"><small>MY PLAYLISTS</small></v-label>

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

            <div v-if="!errorState && !initialLoad" class="middle-container">
                <div
                    v-if="!loadedPlaylist || !loadedPlaylist.song_count"
                    style="margin-left: 100px; margin-top: 200px"
                >
                    <h1>You have no songs</h1>
                    <p>Add some with the button on the bottom right</p>
                </div>

                <!-- Main video player -->
                <video
                    v-show="loadedPlaylist && loadedPlaylist.song_count"
                    ref="video"
                    :key="currentVideoSrc"
                    class="video" controls autoplay
                >
                    <source
                        :src="currentVideoSrc"
                        :type="`video/${currentVideoSrc.split('.').at(-1)}`"
                    />
                    <track
                        v-for="(sub, i) in currentVideoSubs"
                        :key="sub"
                        :label="`${sub.split('.')[1].toUpperCase()}`"
                        kind="subtitles"
                        :srclang="`${sub.split('.')[1]}`"
                        :src="`/files/videos/${encodeURIComponent(currentVideoId)}/${sub}`"
                        :default="i === 0"
                    />
                </video>

                <!-- Desc / meta below player -->
                <div v-if="loadedPlaylist && loadedPlaylist.song_count" class="meta-container px-4 pt-1">
                    <h1 class="text-truncate mr-10 video-title">{{ currentVideoTitle }}</h1>
                    <p class="text-truncate mr-10 video-upload-date">Uploaded {{ currentVideoUploadDate || '(unknown)' }}</p>
                    <hr class="my-2">

                    <v-tabs
                        v-model="tab"
                        class="small-tabs"
                        align-tabs="right"
                    >
                        <v-tab :value="1">Description</v-tab>
                        <v-tab :value="2">Lyrics</v-tab>
                    </v-tabs>
                        
                    <v-window v-model="tab">
                        <v-window-item :value="1" class="pt-1 pb-8">
                            <a class="text-truncate video-artist mr-10 mb-4" :href="currentVideoArtist.url">
                                {{ currentVideoArtist.name || 'Unknown Artist' }}
                            </a>
                            <p class="video-desc" v-html="formatHrefLink(currentVideoDescription, '#42A5F5', true)"></p>

                            <p class="mt-3">
                                <a
                                    class="text-primary text-decoration-none"
                                    target="_blank" rel="noopener noreferrer"
                                    :href="videoHref"
                                >Video ID: {{ songs[currentSongIndex] ? songs[currentSongIndex].id : '' }}</a>
                            </p>
                        </v-window-item>
                        <v-window-item :value="2" class="pt-1 pb-8">
                            <p class="video-desc">{{ songLyrics }}</p>
                        </v-window-item>
                    </v-window>
                </div>
            </div>

            <!-- Song list on right -->
            <div v-if="!errorState && !initialLoad" class="song-list">
                <div class="song-list__header">
                    <div class="pt-4 px-4">
                        <p class="playlist-name text-truncate">{{ loadedPlaylist.name }}</p>
                        <p class="playlist-song-count text-truncate">{{ loadedPlaylist.song_count.toLocaleString() }} song{{ loadedPlaylist.song_count !== 1 ? 's' : '' }}</p>
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

                        <v-tooltip v-if="isOwnPlaylist" text="Edit Playlist" location="top">
                            <template #activator="{ props }">
                                <v-btn
                                    variant="text" size="small" v-bind="props" icon="mdi-playlist-edit"
                                    @click="[currentPlaylistId, editPlaylistModal] = [playlistId, true]"
                                ></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip
                            v-if="loadedPlaylist && loadedPlaylist.perms && loadedPlaylist.perms[user.id] &&
                                [EDIT, OWNER].includes(loadedPlaylist.perms[user.id].perm_level)"
                            text="Share Playlist" location="top"
                        >
                            <template #activator="{ props }">
                                <v-btn
                                    variant="text" size="small" v-bind="props" icon="mdi-account-plus"
                                    @click="sharePlaylistModal = true"
                                ></v-btn>
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
                        v-for="(song, i) in songs"
                        :key="song.id"
                        class="list-item-no-round-avatar"
                        :data-duration="song.duration_string"
                        :prepend-avatar="song.thumbnail_file ? encodeURIComponent(`/files/videos/${song.id}/${song.thumbnail_file}`) : '/default-pfp.png'"
                        :title="song.title"
                        :subtitle="song.uploader"
                        :active="currentSongIndex === i"

                        @click="currentSongIndex = i"
                    ></v-list-item>
                </v-list>

                <v-btn
                    color="red mt-2"
                    block flat
                    prepend-icon="mdi-plus"
                    @click="addSongModal = true"
                >Add Songs</v-btn>
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

            <music-share-modal
                :show="sharePlaylistModal"
                :playlist="loadedPlaylist"

                @update="e => { if (e.type === 'close') sharePlaylistModal = false; }"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <music-add-song-modal
                :show="addSongModal"
                :playlist-id="loadedPlaylist ? loadedPlaylist.id : ''"

                @update="e => { addSongModal = false; }"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />
        </div>
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { useMusicStore } from '~/store/musicStore.js';
import { EDIT, OWNER } from '~/helpers/board/perms.js';
import { formatHrefLink } from '~/helpers/format.js';

export default {
    data() {
        return {
            tab: 1,
            playlists: [],
            songs: [],
            currentSongIndex: 0,
            loadedPlaylist: {},
            playlistIdNameMap: {}, // Id -> name

            // Video
            currentVideoTitle: 'Untitled',
            currentVideoDescription: 'No description provided',
            currentVideoSrc: '',
            currentVideoSubs: [],
            currentVideoId: '',
            currentVideoArtist: {},
            currentVideoUploadDate: '',
            songLyrics: '',

            initialLoad: true,
            errorState: false,

            currentPlaylistId: '',
            editPlaylistModal: false,
            deletePlaylistModal: false,
            sharePlaylistModal: false,
            addSongModal: false,

            // Toasts
            showErrorToast: false,
            showSuccessToast: false,
            toastErrorMsg: '',
            toastSuccessMsg: '',

            EDIT, OWNER
        };
    },
    computed: {
        isLoggedIn() { return useAuthStore(this.$pinia).isLoggedIn; },
        user() { return useAuthStore(this.$pinia).user || {}; },
        playlistId() { return this.$route.query.playlistId; },
        isOwnPlaylist() {
            return this.loadedPlaylist && this.loadedPlaylist.perms &&
                this.loadedPlaylist.perms[this.user.id] &&
                this.loadedPlaylist.perms[this.user.id].perm_level === OWNER;
        },
        videoHref() {
            if (!this.songs[this.currentSongIndex]) return;
            let id = this.songs[this.currentSongIndex].id.split('#');
            if (id[0] === 'yt')
                return `https://www.youtube.com/watch?v=${id[1]}`;
            if (id[0] === 'bilibili')
                return `https://www.bilibili.com/video/${id[1]}/`;
            if (id[0] === 'soundcloud')
                return `${id[1]}`;
            if (id[0] === 'newgrounds')
                return `https://newgrounds.com/audio/listen/${id[1]}`;
            return '';
        }
    },
    watch: {
        '$route.query'() {
            if (this.$route.path === '/music') {
                console.log(this.$route.query);
                this.getCurrentPlaylist();
            }
        },
        currentSongIndex() {
            this.loadCurrentSong();
        }
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
        async loadCurrentSong() {
            if (!this.songs.length) return;
            let song = this.songs[this.currentSongIndex];
            if (!song) return;
            let songId = song.id;

            // Fetch more song metadata
            try {
                let songs = await this.$fetchApi('/api/music/song', 'GET', { id: songId });
                song = songs.song;
            } catch (e) {
                this.showErrorToast = true;
                this.errorState = true;
                this.toastErrorMsg = 'Failed to get song data: ' + this.$apiErrorToString(e);
                return;
            }

            console.log(song)

            this.currentVideoId = songId;
            this.currentVideoSrc = `/files/videos/${encodeURIComponent(songId)}/${song.video_file}`;
            this.currentVideoTitle = song.title;
            this.currentVideoDescription = song.description;
            this.currentVideoSubs = song.subtitle_files;
            this.currentVideoUploadDate = this.$formatTimestamp(song.upload_date);
            this.currentVideoArtist = {
                name: song.uploader,
                url: song.uploader_url
            };

            // TODO: test repeatedly
            setTimeout(() => {
                console.log(this.$refs.video.textTracks.length)
                if (!this.$refs.video.textTracks.length) {
                    this.songLyrics = 'No lyrics provided';
                    return;
                }

                let cues = [...this.$refs.video.textTracks[0].cues];
                let lines = [];
                let dupeLineCount = 0;

                for (let i = 0; i < cues.length; i++) {
                    if (i > 0 && cues[i].startTime - cues[i - 1].endTime > 2) // > 2s delay = new line
                        lines.push('');
                    let line = cues[i].text.replace(/<.+?>/g, '');

                    if (i < cues.length - 1 && cues[i + 1].text.replace(/<.+?>/g, '') !== cues[i].text.replace(/<.+?>/g, '')) {
                        lines.push(line + (dupeLineCount > 0 ? ` (x${dupeLineCount})` : ''));
                        dupeLineCount = 0;
                    }
                    else dupeLineCount++;
                }
                this.songLyrics = lines.join('\n');
            }, 500);
        },

        // Get metadata of current playlist
        async getCurrentPlaylist() {
            if (!this.playlistId) return;
            this.initialLoad = true;
            this.errorState = false;

            try {
                let playlist = await this.$fetchApi('/api/music/playlist/single', 'GET', { id: this.playlistId });
                this.loadedPlaylist = playlist.playlist || {};

                // TODO: pagination + auto scroll
                let songs = await this.$fetchApi('/api/music/playlist/song', 'GET', { id: this.playlistId, limit: 100 });
                this.songs = songs.songs || [];
            } catch (e) {
                console.error(e);
                this.showErrorToast = true;
                this.errorState = true;
                this.toastErrorMsg = 'Failed to get playlist: ' + this.$apiErrorToString(e);
            }
            this.initialLoad = false;
            this.loadCurrentSong();
        },
        // Fetch playlists
        async updatePlaylists() {
            if (!this.isLoggedIn) {
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

    position: fixed;
    top: 80px;
    left: 44px;

    &__list-item {
        cursor: pointer;
        height: $menu-item-height;
        line-height: $menu-item-height;
        user-select: none;

        color: rgb(var(--v-theme-on-surface));
        text-decoration: none;
    }
}

.middle-container {
    width: 100%;
    max-width: calc(100% - 540px);
    margin-left: 239px;
}

.video {
    width: 100%;
    height: 420px;
    background: black;
}

.meta-container {
    .video-title {
        font-weight: normal !important;
        font-size: 22px;
        margin: 4px 0 4px 0;
    }

    .video-upload-date {
        opacity: var(--v-medium-emphasis-opacity);
    }

    .video-artist {
        opacity: 1;
        color: rgb(var(--v-theme-on-surface));
        font-weight: bold;
        text-decoration: none;
        display: block;
    }

    hr {
        height: 0px;
        border: none;
        border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    .small-tabs {
        transform: scale(0.75);
        transform-origin: top left;
    }

    .video-desc {
        white-space: pre-wrap;
        color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
        text-decoration: none !important;
    }
}

.song-list {
    min-width: 290px;
    max-width: 290px;
    box-sizing: border-box;

    position: fixed;
    top: 80px;
    right: 44px;

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
        height: calc(100vh - 230px);
    }
}
</style>

<style lang="scss">
// Make the playlist thumbnails not round, we're using
// the v-list avatars
.list-item-no-round-avatar {
    position: relative;
}

.list-item-no-round-avatar:before {
    content: attr(data-duration);
    position: absolute;
    left: 18px;
    top: 26px;

    font-size: 10px;
    padding: 1px 2px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    z-index: 10;
}

.list-item-no-round-avatar .v-avatar {
    border-radius: 0 !important;
    width: 70px;
}
</style>