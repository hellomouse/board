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
                height="44"
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
                :current-user-perm="board.perms[user.id]?.perm_level"

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

            <BoardDeleteModal
                :show="deleteBoardModal"
                :board="currentBoard"

                @update="onBoardUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <BoardShareModal
                :show="shareBoardModal"
                :board="currentBoard"

                @update="e => { if (e.type === 'close') shareBoardModal = false; }"
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
import { useAuthStore } from '~/store/auth.js';
import BoardBoard from '~/components/board/Board.vue';
import BoardModal from '~/components/board/Modal.vue';

export default {
    name: 'BoardIndexPage',
    components: { BoardBoard, BoardModal },
    data: () => ({
        boards: [],
        currentBoard: {},

        editBoard: false,
        createBoardModal: false,
        shareBoardModal: false,
        deleteBoardModal: false,

        showErrorToast: false,
        showSuccessToast: false,
        toastErrorMsg: '',
        toastSuccessMsg: ''
    }),
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
    },
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
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get boards: ' + this.$apiErrorToString(e);
                return;
            }
        },
        // Handle menu selection for each board
        async onBoardUpdate(msg) {
            if (msg.type === 'open_board_delete') { // Open board delete modal
                this.deleteBoardModal = true;
                this.currentBoard.id = msg.id;
                this.currentBoard.title = msg.title;
            }
            else if (msg.type === 'close_board_delete') // Close board delete modal
                this.deleteBoardModal = false;
            else if (msg.type === 'board_delete') { // Board was deleted
                await this.getBoards();
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board deleted!'];
            }
            else if (msg.type === 'edit') {  // Open edit modal
                this.editBoard = true;
                this.createBoardModal = true;
                this.currentBoard = msg.board;
            }
            else if (msg.type === 'share') { // Open share board modal
                try {
                    this.currentBoard = await this.$fetchApi('/api/board/boards/single', 'GET', { id: msg.id });
                    this.shareBoardModal = true;
                } catch(e) {
                    this.showErrorToast = true;
                    this.toastErrorMsg = 'Failed to get board info: ' + this.$apiErrorToString(e);
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