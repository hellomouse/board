<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
});
</script>

<template>
    <!-- A page to show all the boards the user has -->
    <NuxtLayout name="board">
        <BoardLeftNav>
            <v-btn
                color="red" block
                @click="openCreateBoard"
            >
                <v-icon icon="mdi-plus" /> New Board
            </v-btn>
        </BoardLeftNav>

        <v-container class="container pt-0">
            <BoardBoard
                v-for="board in boards"
                :key="board.id"

                :board-id="board.id"
                :title="board.name"
                :desc="board.desc"
                :creator-id="board.creator"
                :color="board.color"

                @update="onBoardUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            ></BoardBoard>

            <BoardModal
                :edit-mode="editBoard"
                :show="createBoardModal"
                :board="currentBoard"

                @update="onBoardCreate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            />

            <ShareModal
                :show="shareBoardModal"
                :perma-share-link="shareBoardLink"
                :creator="shareBoardCreator"
                :resource-name="shareBoardName"
                :perm-levels="['View', 'Interact', 'Self Edit', 'Edit', 'Owner']"
                :initial-users="shareUsers"
                :initial-public-perm="sharePublicPerm"
                :share-board-modal-loading="shareBoardModalLoading"

                @update="shareModalApply"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

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
        </v-container>
    </NuxtLayout>
</template>

<script>
import BoardBoard from '~/components/board/Board.vue';
import BoardModal from '~/components/board/Modal.vue';

export default {
    name: 'BoardIndexPage',
    components: { BoardBoard, BoardModal },
    data: () => ({
        boards: [],

        editBoard: false,
        createBoardModal: false,
        currentBoard: {},

        shareBoardModal: false,
        sharePublicPerm: '',
        shareBoardModalLoading: false,
        shareUsers: [],
        shareBoardId: '',
        shareBoardCreator: '',
        shareBoardName: '',
        shareBoardLink: '',

        showErrorToast: false,
        showSuccessToast: false,
        toastErrorMsg: '',
        toastSuccessMsg: ''
    }),
    // Get boards on page first load
    async created() {
        this.getBoards();
    },
    methods: {
        async getBoards() {
            try {
                let boards = await this.$fetchApi('/api/board/boards', 'GET', {});
                this.boards = boards.boards;
                console.log(boards.boards)
            } catch (e) {
                console.log(e); // TODO: toast
                return;
            }
        },
        // Handle menu selection for each board
        async onBoardUpdate(msg) {
            if (msg.type === 'board_delete') { // Board was deleted
                await this.getBoards();
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board deleted!'];
            }
            else if (msg.type === 'edit') {  // Open edit modal
                this.editBoard = true;
                this.createBoardModal = true;
                this.currentBoard = msg.board;
            }
            else if (msg.type === 'share') { // Open share board modal
                // TODO: api to get the perms for the board
                try {
                    this.shareBoardId = msg.id;
                    let board = await this.$fetchApi('/api/board/boards/single', 'GET', { id: msg.id });
                    this.sharePublicPerm = board.perms['public']?.perm_level;
                    this.shareBoardCreator = board.creator;
                    this.shareBoardName = board.name;

                    this.shareUsers = Object.keys(board.perms)
                        .filter(key => key !== 'public')
                        .map(key => ({
                            id: key,
                            level: board.perms[key].perm_level,
                            name: 'TODO',
                            pfp_url: 'TODO'
                        }));
                    
                    // TODO: also batch get users

                    // Put creator first, then sort others by id
                    this.shareUsers.sort((a, b) => {
                        if (a.id === board.creator) return -9999999999;
                        if (b.id === board.creator) return  9999999999;
                        return a.id.localeCompare(b.id);
                    });

                    console.log('GOT BOARD', board)
                    this.shareBoardModal = true;
                } catch(e) {
                    /* TODO */
                }
            }
        },
        // Open the create board button
        async openCreateBoard() {
            this.editBoard = false;
            this.createBoardModal = true;
            this.currentBoard = {};
        },
        // Called when a board is newly created or cancelled
        async onBoardCreate(created) {
            this.createBoardModal = false;
            if (created) {
                [this.showSuccessToast, this.toastSuccessMsg] = [true,
                    this.editBoard ? 'Board edited!' : 'Board created!'];
                this.getBoards();
            }
        },
        // Called when share modal is cancelled or applied
        async shareModalApply(newPerms) {
            if (Object.keys(newPerms).length === 0) {
                this.shareBoardModal = false;
                return;
            }
            this.shareBoardModalLoading = true;
            try {
                await this.$fetchApi('/api/board/boards', 'PUT', {
                    id: this.shareBoardId,
                    perms: newPerms
                });
                this.showSuccessToast = true;
                this.toastSuccessMsg = 'Permissions updated!';
            } catch (e) {
                let errorMsg = `Failed to modify board: ${this.$apiErrorToString(e)}`;
                this.showErrorToast = true;
                this.toastErrorMsg = errorMsg;
            }
            this.shareBoardModalLoading = false;
            this.shareBoardModal = false;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
    margin-left: $left-nav-width-pc;
}
</style>