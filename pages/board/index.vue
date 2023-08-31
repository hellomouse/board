<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
    middleware: 'auth'
});

// Default board page desc - will be overwritten later
const BOARD_DESC = 'Make pins to save your random snippets and thoughts';

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Board',
    ogTitle: 'Hellomouse Board',
    description: BOARD_DESC,
    ogDescription: BOARD_DESC,
    ogImage: '/logos/meta/board.png',
    twitterCard: 'summary_large_image',
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

        <v-toolbar class="bulk-board-edits" color="grey-darken-4" :style="{ top: selectedBoards.size ? '0px' : '-100px' }">
            <v-btn icon="mdi-close" @click="deselectAllBoards" />
            <h1>{{ selectedBoards.size }} Selected</h1>
            <v-spacer />

            <v-tooltip text="Change Background" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        id="palette-activator"
                        v-bind="props"
                        icon="mdi-palette"
                    />
                </template>
            </v-tooltip>

            <v-menu activator="#palette-activator" :close-on-content-click="false" location="bottom">
                <v-sheet class="pa-4" width="240">
                    <v-btn
                        v-for="(col, index) in swatches" :key="col"
                        density="compact" width="40" style="min-width: 40px;"
                        :color="col" class="mr-1 mb-1"
                        @click="massColorChange(col, index)"
                    >
                        <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                    </v-btn>
                </v-sheet>
            </v-menu>

            <v-tooltip text="Share Board" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-account-plus"
                    />
                </template>
            </v-tooltip>
        </v-toolbar>

        <v-container class="container-with-left-nav pt-0" :class="containerClass">
            <div v-if="loadingBoards" class="state-loader state-center">
                <v-progress-linear color="primary" indeterminate class="mb-2" />
                Loading Boards...
            </div>

            <div v-if="boards.length === 0 && !loadingBoards" class="state-center empty-state">
                <img src="/empty-state-board.png" width="200">
                <h1>You have no boards</h1>
                <p>Press the 'New Board' button on the left to create one</p>
            </div>
            
            <div class="d-flex flex-direction-row">
                <h1>{{ title }}</h1>

                <v-spacer />

                <div class="[ small-container ] mb-2 d-flex flex-direction-row justify-end">
                    <v-select
                        v-model="sortBy" density="compact" solo-filled max-width="200"
                        flat class="select mr-2"
                        :items="['Name', 'Created', 'Edited']"
                    ></v-select>

                    <v-btn
                        icon variant="text"
                        height="40"
                        @click="toggleSortDirection"
                    >
                        <v-icon class="sort-arrow-down" :class="downArrowClass">mdi-arrow-up</v-icon>
                    </v-btn>
                </div>
            </div>
            
            <div class="scroll-container" @scroll="onScroll"  @click.self="deselectAllBoards()">
                <BoardBoard
                    v-for="board in sortedBoards" :key="board.id"
                    :board-id="board.id"
                    :name="board.name"
                    :desc="board.desc"
                    :creator-id="board.creator"
                    :color="board.color"
                    :current-user-perm="board.perms[user.id]?.perm_level"

                    :select-trigger="selectBoardsTrigger"
                    :unselect-trigger="unselectBoardsTrigger"

                    @update="onBoardUpdate"
                    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
                    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                    @select="onBoardSelect"
                />
            </div>

            <BoardModal
                :edit-mode="editBoard"
                :show="createBoardModal"
                :board="currentBoard"

                @update="onBoardCreateOrEdit"
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
import { useOptionStore } from '~/store/optionStore.js';

import { BOARD_SWATCHES } from '~/helpers/board/board-colors.js';
import BoardBoard from '~/components/board/Board.vue';
import BoardModal from '~/components/board/Modal.vue';

const BOARDS_PER_CHUNK = 40;

export default {
    name: 'BoardIndexPage',
    components: { BoardBoard, BoardModal },
    data() {
        return {
            swatches: BOARD_SWATCHES,
            boards: [],
            currentBoard: {},
            loadingBoards: true,
            title: 'My boards',

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
            sortBy: useOptionStore(this.$pinia).sort_boards[0] === undefined ?
                'Name' : useOptionStore(this.$pinia).sort_boards[0],
            sortDown: useOptionStore(this.$pinia).sort_boards[1] === undefined ?
                true : useOptionStore(this.$pinia).sort_boards[1],

            // Inf scroll
            reachedEnd: false,

            // Selection
            selectedBoards: new Set(),
            selectBoardsTrigger: false,
            unselectBoardsTrigger: false,
            color: '',
            selectedSwatchIndex: 0
        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        },
        sortedBoards() {
            let multiplier = this.sortDown ? 1 : -1;
            let key = {
                Name: 'name',
                Created: 'created',
                Edited: 'edited'
            }[this.sortBy];

            return this.boards.sort((a, b) => {
                return a[key].toLowerCase() > b[key].toLowerCase() ? multiplier : -multiplier;
            });
        },
        containerClass() {
            return useOptionStore(this.$pinia).expand_left_nav ? '' : 'sidenav-hidden';
        }
    },
    watch: {
        sortBy() {
            useOptionStore(this.$pinia).sort_boards[0] = this.sortBy;
            this.getBoards();
        },
        sortDown() {
            useOptionStore(this.$pinia).sort_boards[1] = this.sortDown;
            this.getBoards();
        },
        '$route.query'() {
            this.selectedBoards = new Set();
            this.updatePageTitle();
            this.getBoards();
        }
    },
    mounted() {
        if (process.client)
            document.addEventListener('keydown', this.keyupHandler);
    },
    destroyed() {
        if (process.client)
            document.removeEventListener('keydown', this.keyupHandler);
    },
    // Get boards on page first load
    created() {
        this.updatePageTitle();
        this.getBoards();
    },
    methods: {
        updatePageTitle() {
            this.title = 'My boards';
            if (this.$route.query.shared_with_me)
                this.title = 'Shared with me';
            if (this.$route.query.search)
                this.title = 'Search Results';
        },
        async load() {
            if (this.reachedEnd) return;
            let boards = [];
            try {
                boards = await this.loadBoards(this.boards.length, BOARDS_PER_CHUNK);
                this.boards = this.boards.concat(boards);
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get boards: ' + this.$apiErrorToString(e);
            }
            if (!boards.length)
                this.reachedEnd = true;
        },
        async loadBoards(offset, limit) {
            this.reachedEnd = false;
            let opts = {
                not_self: this.$route.query.shared_with_me ? true : false,
                offset, limit,
                sort_by: this.sortBy,
                sort_down: this.sortDown
            };
            if (this.$route.query.search && this.$route.query.search.length > 3)
                opts.query = this.$route.query.search;

            if (opts.query)
                opts = this.$processSearchParams(opts, 'owner_search');
            else
                opts.owner_search = useAuthStore(this.$pinia).user.id;

            let boards = await this.$fetchApi('/api/board/boards', 'GET', opts);
            return boards.boards;
        },
        async getBoards() {
            this.boards = [];
            this.loadingBoards = true;
            try {
                this.boards = await this.loadBoards(0, BOARDS_PER_CHUNK);
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get boards: ' + this.$apiErrorToString(e);
            }
            this.loadingBoards = false;
        },
        // Handle menu selection for each board
        async onBoardUpdate(msg) {
            if (msg.type === 'open_board_delete') { // Open board delete modal
                this.deleteBoardModal = true;
                this.currentBoard.id = msg.id;
                this.currentBoard.name = msg.name;
            }
            else if (msg.type === 'close_board_delete') // Close board delete modal
                this.deleteBoardModal = false;
            else if (msg.type === 'board_delete') { // Board was deleted
                this.boards = this.boards.filter(b => b.id !== msg.id);
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
        async onBoardCreateOrEdit(created) {
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
        },
        // Infinite scroll
        onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
            if (scrollTop + clientHeight >= scrollHeight) 
                this.load();
        },
        // Selection
        onBoardSelect(update) {
            if (!update.select)
                this.selectedBoards.delete(update.id);
            else
                this.selectedBoards.add(update.id);
        },
        deselectAllBoards() {
            this.selectedBoards.clear();
            this.unselectBoardsTrigger = !this.unselectBoardsTrigger;
        },
        selectAllBoards() {
            this.selectedBoards = new Set(this.boards.map(b => b.id));
            this.selectBoardsTrigger = !this.selectBoardsTrigger;
        },
        async massColorChange(col, index) {
            try {
                let opts = { board_ids: [...this.selectedBoards], color: col };
                await this.$fetchApi('/api/board/boards/bulk_colors', 'PUT', opts);
    
                [this.color, this.selectedSwatchIndex] = [col, index];
                for (let board of this.boards) {
                    if (this.selectedBoards.has(board.id))
                        board.color = col;
                }
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to edit board info: ' + this.$apiErrorToString(e);
            }
        },
        keyupHandler(event) {
            if (event.ctrlKey && event.key === 'a') { // Ctrl-A select all boards
                event.preventDefault();
                this.selectAllBoards();
                return false;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/state.scss";

.scroll-container {
    max-height: calc(100vh - 150px);
    height: calc(100vh - 150px);
    overflow-y: auto;
}

.bulk-board-edits {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1999;
}
</style>