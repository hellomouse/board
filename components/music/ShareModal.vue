<template>
    <ShareModal
        :show="show"
        :perma-share-link="shareUrl()"
        :creator="sharePlaylistCreator"
        :resource-name="sharePlaylistName"
        :perm-levels="['View', 'Edit', 'Owner']"
        :initial-users="shareUsers"
        :initial-public-perm="sharePublicPerm"
        :share-playlist-modal-loading="showLoading"
        :loading-data="loadingData"

        @update="shareModalApply"
        @error="e => $emit('error', e)"
        @success="e => $emit('success', e)"
    />
</template>

<script>
import { useAuthStore } from '~/store/auth.js';

export default {
    props: {
        // Whether to show modal
        show: {
            type: Boolean,
            required: true
        },
        // Playlist object to get data from
        playlist: {
            type: Object,
            required: true
        },
        loadingData: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        sharePublicPerm: '',
        showLoading: false,
        shareUsers: [],
        sharePlaylistId: '',
        sharePlaylistCreator: '',
        sharePlaylistName: ''
    }),
    watch: {
        async playlist(newVal, _oldVal) {
            if (!Object.keys(newVal).length || !newVal.perms)
                return;
            if (!useAuthStore(this.$pinia).isLoggedIn)
                return;

            let playlist = newVal;
            this.sharePlaylistId = playlist.id;
            this.sharePublicPerm = (playlist && playlist.perms) ? playlist.perms['public']?.perm_level : '';
            this.sharePlaylistCreator = playlist.creator_id;
            this.sharePlaylistName = playlist.name;

            // Batch get user info
            let users = {};
            try {
                let batch = await this.$fetchApi('/api/users/batch', 'GET', { ids: Object.keys(playlist.perms).join(',') });
                batch.users.forEach(user => users[user.id] = user);
            } catch(e) {
                this.$emit('error', 'Error getting users: ' + this.$apiErrorToString(e));
                return;
            }

            this.shareUsers = Object.keys(playlist.perms)
                .filter(key => key !== 'public')
                .map(key => ({
                    id: key,
                    level: playlist.perms[key].perm_level,
                    name: users[key].name,
                    pfp_url: users[key].pfp_url
                }));

            // Put creator first, then sort others by id
            this.shareUsers.sort((a, b) => {
                if (a.id === playlist.creator_id) return -9999999999;
                if (b.id === playlist.creator_id) return 9999999999;
                return a.id.localeCompare(b.id);
            });
        }
    },
    methods: {
        // Called when share modal is cancelled or applied
        async shareModalApply(newPerms) {
            // Cancelled: just close modal
            if (Object.keys(newPerms).length === 0) {
                this.$emit('update', { type: 'close' });
                return;
            }
            this.showLoading = true;
            try {
                await this.$fetchApi('/api/music/playlist/perms', 'PUT', {
                    id: this.sharePlaylistId,
                    perms: newPerms
                });
                this.$emit('success', 'Permissions updated!');
            } catch (e) {
                let errorMsg = `Failed to modify playlist: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.showLoading = false;
            this.$emit('update', { type: 'close' });
        },
        shareUrl() {
            return process.client ? (window.location.origin + '/music?playlistId=' + this.playlist.id) : '';
        }
    }
}
</script>
