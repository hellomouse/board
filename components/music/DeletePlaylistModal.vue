<template>
    <DeleteConfirmation
        title="Delete Playlist"
        :show="show"
        :loading="deleteModalLoading"
        :confirmation-string="playlistName || ''"
        @update="die => deletePlaylist(die)"
    >
        <p>
            Are you sure you want to delete this playlist?
            This will delete <b>all songs</b> associated
            with the playlist and <b>cannot be undone!</b>
        </p>
    </DeleteConfirmation>
</template>

<script>
export default {
    props: {
        playlistId: {
            type: String,
            required: true
        },
        playlistName: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    data: () => ({
        deleteModalLoading: false
    }),
    methods: {
        async deletePlaylist(shouldDelete) {
            if (!shouldDelete) {
                this.$emit('update', { type: 'close_playlist_delete' });
                return;
            }

            this.deleteModalLoading = true;
            try {
                await this.$fetchApi('/api/music/playlist', 'DELETE', { id: this.playlistId });
                this.$emit('update', { type: 'playlist_delete', id: this.playlistId });
            } catch (e) {
                let errorMsg = `Failed to delete playlist: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            this.$emit('update', { type: 'close_playlist_delete' });
            this.deleteModalLoading = false;
        }
    }
}
</script>
