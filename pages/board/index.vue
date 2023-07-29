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
                :show="true"

                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
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