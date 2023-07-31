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
            <div class="[ small-container ] mb-2 d-flex flex-direction-row justify-end">
                <v-select
                    v-model="sortBy" density="compact" solo-filled max-width="200"
                    flat class="select mr-2"
                    :items="['Created', 'Modified']"
                ></v-select>

                <v-btn
                    icon variant="text"
                    height="40"
                    @click="toggleSortDirection"
                >
                    <v-icon class="sort-arrow-down" :class="downArrowClass">mdi-arrow-up</v-icon>
                </v-btn>
            </div>
    
            <BoardBoard
                v-for="board in sortedBoards"
                :key="board.id"

                :board-id="board.id"
                :title="board.name"
                :desc="board.desc"
                :creator-id="board.creator"
                :color="board.color"
                :current-user-perm="board.perms[user.id]?.perm_level"

                @update="onBoardUpdate"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
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

        // Modal show
        editBoard: false,
        createBoardModal: false,
        shareBoardModal: false,
        deleteBoardModal: false,

        // Toasts
        showErrorToast: false,
        showSuccessToast: false,
        toastErrorMsg: '',
        toastSuccessMsg: '',

        // Sorting:
        sortBy: 'Created',
        sortDown: true,
    }),
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        },
        sortedBoards() {
            let multiplier = this.sortDown ? -1 : 1;
            let key = this.sortBy === 'Created' ? 'created' : 'edited';
            return this.boards.sort((a, b) => {
                return a[key] > b[key] ? multiplier : -multiplier;
            });
        }
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
        // Toggle sort dir
        toggleSortDirection() {
            this.sortDown = !this.sortDown;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
    margin-left: $left-nav-width-pc;
}
</style>