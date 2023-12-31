<!--
Wrapper around the share modal for boards

Example usage:

<BoardShareModal
    :show="shareBoardModal"    Whether to show the modal or not
    :board="currentBoard"      Object for current board

    @update="e => { if (e.type === 'close') shareBoardModal = false; }"
    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
/>
-->

<template>
    <ShareModal
        :show="show"
        :perma-share-link="shareUrl()"
        :creator="shareBoardCreator"
        :resource-name="shareBoardName"
        :perm-levels="['View', 'Interact', 'SelfEdit', 'Edit', 'Owner']"
        :initial-users="shareUsers"
        :initial-public-perm="sharePublicPerm"
        :share-board-modal-loading="showLoading"
        :loading-data="loadingData"

        @update="shareModalApply"
        @error="e => $emit('error', e)"
        @success="e => $emit('success', e)"
    />
</template>

<script>
export default {
    name: 'BoardShareModal',
    props: {
        // Whether to show modal
        show: {
            type: Boolean,
            required: true
        },
        // Board object to get data from
        board: {
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
        shareBoardId: '',
        shareBoardCreator: '',
        shareBoardName: ''
    }),
    watch: {
        async board(newVal, _oldVal) {
            if (!Object.keys(newVal).length || !newVal.perms)
                return;

            let board = newVal;
            this.shareBoardId = board.id;
            this.sharePublicPerm = (board && board.perms) ? board.perms['public']?.perm_level : '';
            this.shareBoardCreator = board.creator;
            this.shareBoardName = board.name;

            // Batch get user info
            let users = {};
            try {
                let batch = await this.$fetchApi('/api/users/batch', 'GET', { ids: Object.keys(board.perms).join(',') });
                batch.users.forEach(user => users[user.id] = user);
            } catch(e) {
                this.$emit('error', 'Error getting users: ' + this.$apiErrorToString(e));
                return;
            }

            this.shareUsers = Object.keys(board.perms)
                .filter(key => key !== 'public')
                .map(key => ({
                    id: key,
                    level: board.perms[key].perm_level,
                    name: users[key].name,
                    pfp_url: users[key].pfp_url
                }));

            // Put creator first, then sort others by id
            this.shareUsers.sort((a, b) => {
                if (a.id === board.creator) return -9999999999;
                if (b.id === board.creator) return 9999999999;
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
                await this.$fetchApi('/api/board/boards', 'PUT', {
                    id: this.shareBoardId,
                    perms: newPerms
                });
                this.$emit('success', 'Permissions updated!');
            } catch (e) {
                let errorMsg = `Failed to modify board: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.showLoading = false;
            this.$emit('update', { type: 'close' });
        },
        shareUrl() {
            return process.client ? (window.location.origin + '/board/board?id=' + this.board.id) : '';
        }
    }
}
</script>
