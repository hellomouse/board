<!--
Wrapper around the mass share modal for boards

Example usage:

<BoardMassShareModal
    :show="massShareBoardModal"    Whether to show the modal or not
    :boards="selectedBoards"       Selected board ids

    @update="e => { if (e.type === 'close') shareBoardModal = false; }"
    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
/>
-->

<template>
    <div>
        <ShareModal
            :show="show"
            :perma-share-link="''"
            :creator="shareBoardCreator"
            :resource-name="shareBoardName"
            :perm-levels="['View', 'Interact', 'SelfEdit', 'Edit', 'Owner']"
            :initial-users="shareUsers"
            :initial-public-perm="sharePublicPerm"
            :share-board-modal-loading="showLoading"
            :force-edit="true"

            @update="shareModalApply"
            @error="e => $emit('error', e)"
            @success="e => $emit('success', e)"
        />
        <v-snackbar
            v-model="showWarningToast" color="warning" rounded="0" theme="dark"
            transition="scroll-y-reverse-transition"
        >
            {{ toastWarningMsg }}
        </v-snackbar>
    </div>
</template>

<script>
import { OWNER } from '~/helpers/board/perms.js';

export default {
    name: 'BoardShareModal',
    props: {
        // Whether to show modal
        show: {
            type: Boolean,
            required: true
        },
        // Board IDs
        boards: {
            type: Array,
            required: true
        },
        hasEditPermissionOnAllSelectedBoards: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            sharePublicPerm: '',
            showLoading: false,
            shareUsers: [],
            shareBoardId: '',
            shareBoardCreator: '',
            initialPerms: {},
            shareBoardName: this.boards.length + ' Boards',
            showWarningToast: false,
            toastWarningMsg: 'You do not have edit permissions on all selected boards, these will be ignored'
        }
    },
    watch: {
        async show(newVal) {
            this.showWarningToast = newVal && !this.hasEditPermissionOnAllSelectedBoards;
            if (!newVal || !this.boards.length) return;
            this.shareBoardName = this.boards.length + ' Boards';

            try {
                let tmp = await this.$fetchApi('/api/board/boards/perms/bulk', 'POST', {
                    board_ids: this.boards });

                tmp = tmp.perms;
                this.sharePublicPerm = tmp['public'] ? tmp['public'].perm.perm_level : '';
                this.initialPerms = {...tmp};

                tmp = Object.keys(tmp)
                    .filter(x => x !== 'public')
                    .map(x => ({
                        id: x,
                        name: tmp[x].name,
                        pfp_url: '',
                        level: tmp[x].perm.perm_level
                    }));

                // Put owners first, then sort others by id
                tmp.sort((a, b) => {
                    if (a.level === OWNER) return -9999999999;
                    if (b.level === OWNER) return 9999999999;
                    return a.id.localeCompare(b.id);
                });

                this.shareUsers = tmp;
            } catch (e) {
                console.error(e)
                let errorMsg = `Failed to get user permissions: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
                return;
            }
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

            const keys1 = Object.keys(newPerms);
            const keys2 = Object.keys(this.initialPerms);
            const usersRemoved = keys2.filter(x => !keys1.includes(x));

            try {
                await this.$fetchApi('/api/board/boards/perms/bulk', 'PUT', {
                    board_ids: this.boards,
                    perms_to_add: newPerms,
                    users_to_delete: usersRemoved
                });
                this.$emit('success', 'Permissions updated!');
            } catch (e) {
                console.error(e);
                let errorMsg = `Failed to modify board: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.showLoading = false;
            this.$emit('update', { type: 'close' });
        }
    }
}
</script>
