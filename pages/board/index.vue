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
        <BoardLeftNav @click-my-boards="switchTag({})">
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        color="red" block
                        height="44"
                        v-bind="props"
                    >
                        <v-icon icon="mdi-plus" /> New Board
                    </v-btn>
                </template>
            
                <v-sheet elevation="8" rounded="0">
                    <button
                        class="px-4 py-2 hoverable hover-list-item"
                        :disabled="currentActiveTag.name"
                        @click="currentBoardTag = {}; openboardEditTagModal();"
                    >
                        <v-icon icon="mdi-tag" />Filter Tag
                    </button>
                    <button class="px-4 py-2 hoverable hover-list-item" @click="openCreateBoard">
                        <v-icon icon="mdi-view-dashboard" />Board
                    </button>
                </v-sheet>
            </v-menu>
        </BoardLeftNav>

        <v-toolbar 
            class="bulk-board-edits" color="grey-darken-4"
            :style="{ top: (selectedBoards.size + selectedTags.size) ? '0px' : '-100px' }"
        >
            <v-btn icon="mdi-close" @click="deselectAllBoardsAndTags" />
            <h1>{{ selectedBoards.size + selectedTags.size }} Selected</h1>
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
                <v-sheet class="pa-4" width="208">
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

            <v-tooltip :disabled="!canBulkOpBoards" text="Share Boards" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        :disabled="!canBulkOpBoards || canBulkOpTags"
                        v-bind="props"
                        icon="mdi-account-plus"
                        @click="openMassShareBoardModal()"
                    />
                </template>
            </v-tooltip>
        </v-toolbar>

        <v-container
            v-if="$route.path === '/board'"
            class="container-with-left-nav pt-0" :class="containerClass"
        >
            <div v-if="loadingBoards" class="state-loader state-center">
                <v-progress-linear color="primary" indeterminate class="mb-2" />
                Loading Boards...
            </div>

            <div v-if="sortedBoards.length === 0 && !loadingBoards" class="state-center empty-state">
                <img src="/empty-state-board.png" width="200">
                <h1>You have no boards</h1>
                <p>Press the 'New Board' button on the left to create one</p>
            </div>
            
            <div class="d-flex flex-direction-row">
                <h1>
                    <span
                        style="cursor: pointer" @click="switchTag({})"
                        @drop="onBoardDrop($event, -1)"
                        @dragover.prevent
                        @dragenter.prevent
                    >
                        {{ title }}
                    </span>
                    <span v-if="currentActiveTag.name">
                        <v-icon icon="mdi-chevron-right" />
                        {{ currentActiveTag.name }}
                    </span>
                </h1>

                <v-spacer @click="deselectAllBoardsAndTags()" />

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


            <!-- Boards and tags -->
            <!-- ----------------- -->
            <div v-if="!loadingBoards" class="scroll-container" @scroll="onScroll" @click.self="deselectAllBoardsAndTags()">
                <div
                    v-if="boards.length > 0 && tags.length > 0 && !currentActiveTag.name && !$route.query.shared_with_me && $route.path === '/board'"
                    @click.self="deselectAllBoardsAndTags()"
                >
                    <v-label>Tag Groups</v-label>
                    <div class="mb-2" @click.self="deselectAllBoardsAndTags()">
                        <board-tag-filter
                            v-for="tag in tags" :key="tag.id"
                            v-model:selected="tag.selected"
                            :name="tag.name" :color="tag.color" :tag="{...tag}"

                            @drop="onBoardDrop($event, tag.id)"
                            @dragover.prevent
                            @dragenter.prevent

                            @select="onTagSelect"
                            @add-remove-boards="e => { currentBoardTag = e; modals.boardEditTagBoardsModal = true; }"
                            @edit="e => { currentBoardTag = e; modals.boardEditTagModal = true; }"
                            @delete="val => { [modals.deleteTagModal, tagToDelete] = [true, val]; }"
                            @filter="switchTag(tag)"
                        />
                    </div>
                </div>

                <v-label v-if="sortedBoards.length > 0">Boards</v-label><br>
                <board-board
                    v-for="board in sortedBoards" :key="board.id"
                    v-model:selected="board.selected"
                    :board-id="board.id"
                    :name="board.name"
                    :desc="board.desc"
                    :creator-id="board.creator"
                    :color="board.color"
                    :current-user-perm="board.perms[user.id]?.perm_level"

                    :draggable="true"
                    @dragstart="onBoardStartDrag($event, board.id)"

                    @update="onBoardUpdate"
                    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
                    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                    @select="onBoardSelect"
                />
            </div>


            <!-- Modals -->
            <!-- ----------------- -->
            <lazy-board-modal
                :edit-mode="modals.editBoardModal"
                :show="modals.createBoardModal"
                :board="currentBoard"
                :active-tag-id="currentActiveTag.name ? currentActiveTag.id : -1"

                @update="onBoardCreateOrEdit"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            />

            <lazy-board-delete-modal
                :show="modals.deleteBoardModal"
                :board="currentBoard"

                @update="onBoardUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <lazy-board-share-modal
                :show="modals.shareBoardModal"
                :board="currentBoard"

                @update="e => { if (e.type === 'close') modals.shareBoardModal = false; }"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <lazy-board-mass-share-modal
                :show="modals.massShareBoardModal"
                :boards="[...selectedBoards]"
                :has-edit-permission-on-all-selected-boards="hasEditPermissionOnAllSelectedBoards"

                @update="e => { if (e.type === 'close') modals.massShareBoardModal = false; }"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <lazy-board-edit-tag-modal
                :show="modals.boardEditTagModal"
                :tag="currentBoardTag"

                @update="onTagUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <lazy-board-edit-tag-boards-modal
                :show="modals.boardEditTagBoardsModal"
                :tag="currentBoardTag"

                @update="onTagUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <lazy-board-move-to-tag-modal
                :show="modals.moveBoardToTagModal"
                :tags="tags"
                :board-id="currentBoard.id || ''"
  
                @update="onBoardTagMoveUpdate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
                @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
            />

            <v-dialog v-model="modals.deleteTagModal" width="400">
                <v-card rounded="0">
                    <v-card-text>
                        <h1>Delete Tag Group</h1>
                        Are you sure you want to delete this tag group (<code>{{ tagToDelete.name }}</code>)?
                        <b>Boards inside this group will not be deleted.</b>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" @click="modals.deleteTagModal = false">Cancel</v-btn>
                        <v-btn color="primary" @click="deleteTag(tagToDelete); modals.deleteTagModal = false">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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

import { EDIT, OWNER } from '~/helpers/board/perms.js';
import { BOARD_SWATCHES } from '~/helpers/board/board-colors.js';
import BoardBoard from '~/components/board/Board.vue';

const BOARDS_PER_CHUNK = 40;

export default {
    components: { BoardBoard },
    data() {
        return {
            swatches: Object.freeze(BOARD_SWATCHES),
            boards: [],
            tags: [],
            currentBoard: {},
            currentBoardTag: {},
            currentActiveTag: {},
            loadingBoards: true,
            title: 'My boards',
            tagToDelete: {},

            // Modal show
            modals: {
                editBoardModal: false,
                createBoardModal: false,
                shareBoardModal: false,
                massShareBoardModal: false,
                deleteBoardModal: false,
                boardEditTagModal: false,
                boardEditTagBoardsModal: false,
                deleteTagModal: false,
                moveBoardToTagModal: false,
            },

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
            selectedTags: new Set(),
            selectedColor: '',
            selectedSwatchIndex: 0,
            startSelection: -1, // For shift select
            previousI: -1, // For shift select
            shiftKey: false,

            // Filtering
            boardIdFilter: []
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

            let boards = this.currentActiveTag.name ?
                this.boards.filter(b => this.boardIdFilter.includes(b.id)) :
                this.boards.filter(b => !this.boardIdsInATagGroup.includes(b.id));

            return boards.sort((a, b) => {
                return a[key].toLowerCase() > b[key].toLowerCase() ? multiplier : -multiplier;
            });
        },
        containerClass() {
            return useOptionStore(this.$pinia).expand_left_nav ? '' : 'sidenav-hidden';
        },
        hasEditPermissionOnAllSelectedBoards() {
            let user = useAuthStore(this.$pinia).user.id;
            return this.boards.filter(b => this.selectedBoards.has(b.id))
                .every(b => b.perms[user] && [EDIT, OWNER].includes(b.perms[user].perm_level));
        },
        boardIdsInATagGroup() {
            let ids = new Set();
            for (let tag of this.tags) {
                for (let id of tag.board_ids)
                    ids.add(id);
            }
            return [...ids];
        },
        canBulkOpBoards() { return this.selectedBoards.size > 0; },
        canBulkOpTags() { return this.selectedTags.size > 0; }
    },
    watch: {
        sortBy() {
            useOptionStore(this.$pinia).sort_boards[0] = this.sortBy;
            this.getBoardsAndTags();
        },
        sortDown() {
            useOptionStore(this.$pinia).sort_boards[1] = this.sortDown;
            this.getBoardsAndTags();
        },
        '$route.query'() {
            if (this.$route.path === '/board') {
                this.selectedTags = new Set();
                this.selectedBoards = new Set();
                this.updatePageTitle();
                this.getBoardsAndTags();
            }
        },
        '$route.path'() {
            if (this.$route.path !== '/board' && process.client) {
                document.removeEventListener('keydown', this.keydownHandler);
                document.removeEventListener('keyup', this.keyupHandler);
            }
        }
    },
    mounted() {
        if (process.client) {
            document.addEventListener('keydown', this.keydownHandler);
            document.addEventListener('keyup', this.keyupHandler);
        }
    },
    destroyed() {
        if (process.client) {
            document.removeEventListener('keydown', this.keydownHandler);
            document.removeEventListener('keyup', this.keyupHandler);
        }
    },
    // Get boards on page first load
    created() {
        this.updatePageTitle();
        this.getBoardsAndTags();
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
                this.startSelection = -1;
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
        async getTags() {
            try {
                let tags = await this.$fetchApi('/api/board/tags', 'GET', {});
                this.tags = tags.tags;

                let tagIdMap = {};
                for (let tag of this.tags)
                    tagIdMap[tag.id] = tag;

                // Current active tag no longer exists
                if (!tagIdMap[this.currentActiveTag.id])
                    this.switchTag({});
                // Otherwise update current tag
                else {
                    this.currentActiveTag = tagIdMap[this.currentActiveTag.id];
                    this.boardIdFilter = this.currentActiveTag.board_ids;
                }
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get tags: ' + this.$apiErrorToString(e);
            }
        },
        async getBoardsAndTags() {
            this.startSelection = -1;
            this.loadingBoards = true;

            await this.getTags();

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
                this.modals.deleteBoardModal = true;
                this.currentBoard.id = msg.id;
                this.currentBoard.name = msg.name;
            }
            else if (msg.type === 'close_board_delete') // Close board delete modal
                this.modals.deleteBoardModal = false;
            else if (msg.type === 'board_delete') { // Board was deleted
                this.startSelection = -1;
                this.boards = this.boards.filter(b => b.id !== msg.id);
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board deleted!'];
            }
            else if (msg.type === 'edit') {  // Open edit modal
                this.modals.editBoardModal = true;
                this.modals.createBoardModal = true;
                this.currentBoard = msg.board;
            }
            else if (msg.type === 'share') { // Open share board modal
                await this.openShareModal(msg.id);
            }
            else if (msg.type === 'edit-tags') { // Open edit tag modal
                this.modals.moveBoardToTagModal = true;
                this.currentBoard.id = msg.id;
            }
        },
        // Handle tag moving
        onBoardTagMoveUpdate(msg) {
            if (msg.to_tag_id) {
                for (let tag of this.tags) {
                    if (tag.id === msg.to_tag_id)
                        tag.board_ids = [...new Set(tag.board_ids.concat([msg.board_id]))];
                    else
                        tag.board_ids = tag.board_ids.filter(id => id !== msg.board_id);
                }
            }
            this.modals.moveBoardToTagModal = false;
        },
        openboardEditTagModal() {
            // Ensure matches server side, somewhat arbitrary
            const MAX_TAG_COUNT = 200;

            // Check if the user has too many tags
            if (this.tags.length >= MAX_TAG_COUNT) {
                this.showErrorToast = true;
                this.toastErrorMsg = `You have reached the maximum number of tags (${MAX_TAG_COUNT})`;
                return;
            }
            this.modals.boardEditTagModal = true;
        },
        // When tag edit modal is done
        async onTagUpdate(update) {
            if (update) {
                if (update.id) {
                    let tag = this.getTagById(update.id);
                    // We bulk modified tags
                    if (update.board_ids_to_delete || update.board_ids_to_add) {
                        tag.board_ids = tag.board_ids.filter(b => !update.board_ids_to_delete.includes(b));
                        tag.board_ids = tag.board_ids.concat(update.board_ids_to_add);
                    }
                    // We edited a single tag
                    else {
                        tag.name = update.name || tag.name;
                        tag.color = update.color || tag.color;
                        tag.board_ids = update.board_ids || tag.board_ids;
                    }
                    this.tags = this.tags.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
                } else {
                    // We created a tag, need to refetch
                    // to get its ID and other data
                    await this.getTags();
                }
            }
            this.modals.boardEditTagModal = false;
            this.modals.boardEditTagBoardsModal = false;
        },
        // Delete a tag
        async deleteTag(tag) {
            await this.$fetchApi('/api/board/tags', 'DELETE', { ids: [tag.id] });
            this.tags = this.tags.filter(t => t.id !== tag.id);
            [this.toastSuccessMsg, this.showSuccessToast] = ['Tag Deleted!', true];
        },
        async openShareModal(id) {
            try {
                this.modals.shareBoardModal = true;
                this.currentBoard = await this.$fetchApi('/api/board/boards/single', 'GET', { id: id });
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get board info: ' + this.$apiErrorToString(e);
            }
        },
        // Open the create board button
        async openCreateBoard() {
            this.modals.editBoardModal = false;
            this.modals.createBoardModal = true;
            this.currentBoard = {};
        },
        // Called when a board is newly created or cancelled
        async onBoardCreateOrEdit(created) {
            this.modals.createBoardModal = false;
            if (created) {
                [this.showSuccessToast, this.toastSuccessMsg] = [true,
                    this.modals.editBoardModal ? 'Board edited!' : 'Board created!'];
                this.getBoardsAndTags();
            }
        },

    
        // Navigation
        // ------------------

        // Switch folder
        switchTag(tag) {
            this.deselectAllBoardsAndTags();
            this.currentActiveTag = tag;
            this.boardIdFilter = tag.board_ids;
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
        getTagById(id) {
            for (let tag of this.tags) {
                if (tag.id === id)
                    return tag;
            }
            return {};
        },


        // Selection
        // ------------------
        onTagSelect(update) {
            let tag = this.getTagById(update.id);
            if (!tag.name) return;

            tag.selected = update.select;
            if (!update.select)
                this.selectedTags.delete(update.id);
            else if (update.select)
                this.selectedTags.add(update.id);
        },
        onBoardSelect(update) {
            let i = this.boards.map(b => b.id).indexOf(update.id);
            if (this.startSelection > -1 && !this.boards[this.startSelection].selected)
                this.startSelection = -1;

            /**
             * Fill range of indices in board with selected value
             * @param {*} that this
             * @param {number} start Start index
             * @param {number} end End index
             * @param {boolean} value Value of selected
             */
            function fillSelectionRange(that, start, end, value) {
                if (start > end) [end, start] = [start, end];
                for (let i = start; i <= end; i++) {
                    that.selectedBoards.add(that.boards[i].id);
                    that.boards[i].selected = value;
                }
            }

            if (this.shiftKey && this.startSelection > -1) { // Group selection
                fillSelectionRange(this, this.startSelection, this.previousI, false);
                fillSelectionRange(this, this.startSelection, i, true);
            }
            else if (!update.select)
                this.selectedBoards.delete(update.id);
            if (update.select) {
                this.selectedBoards.add(update.id);
                if (!this.shiftKey || this.startSelection < 0)
                    this.startSelection = i;
            }
            this.previousI = i;
        },
        deselectAllBoardsAndTags() {
            this.selectedBoards.clear();
            this.selectedTags.clear();
            this.boards.forEach(b => b.selected = false);
            this.tags.forEach(b => b.selected = false);
            this.startSelection = -1;
        },
        selectAllBoardsAndTags() {
            this.selectedBoards = new Set(this.sortedBoards.map(b => b.id));
            this.sortedBoards.forEach(b => b.selected = true);

            if (this.currentActiveTag.name) {
                this.selectedTags = new Set();
                this.tags.forEach(b => b.selected = false);
            } else {
                this.selectedTags = new Set(this.tags.map(b => b.id));
                this.tags.forEach(b => b.selected = true);
            }
        },
        async openMassShareBoardModal() {
            let selected = [...this.selectedBoards];
            if (!selected.length) return;
            else if (selected.length === 1) await this.openShareModal(selected[0]);
            else this.modals.massShareBoardModal = true;
        },
        async massColorChange(col, index) {
            try {
                // Edit board colors
                if (this.selectedBoards.size) {
                    let opts = { board_ids: [...this.selectedBoards], color: col };
                    await this.$fetchApi('/api/board/boards/bulk_colors', 'PUT', opts);

                    for (let board of this.boards) {
                        if (this.selectedBoards.has(board.id))
                            board.color = col;
                    }
                }
                // Edit tag colors
                if (this.selectedTags.size) {
                    let opts = { tag_ids: [...this.selectedTags], color: col };
                    await this.$fetchApi('/api/board/tags/bulk_colors', 'PUT', opts);

                    for (let tag of this.tags) {
                        if (this.selectedTags.has(tag.id))
                            tag.color = col;
                    }
                }
                [this.selectedColor, this.selectedSwatchIndex] = [col, index];
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to edit colors: ' + this.$apiErrorToString(e);
            }
        },
        keydownHandler(event) {
            this.shiftKey = event.shiftKey;

            // Ctrl-A select all boards
            if (event.ctrlKey && event.key === 'a' && !Object.keys(this.modals).some(x => x)) {
                event.preventDefault();
                this.selectAllBoardsAndTags();
                return false;
            }
            return true;
        },
        keyupHandler(event) {
            this.shiftKey = event.shiftKey;
            return true;
        },
        // Dragging boards to tags
        onBoardStartDrag(evt, id) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('id', id);
        },
        async onBoardDrop(evt, targetId) {
            let boardIds = [evt.dataTransfer.getData('id')];
            if (this.selectedBoards.has(boardIds[0]))
                boardIds = [...this.selectedBoards];

            // Target ID < 0 means move to main menu, but must be in a tag group
            // in order to do this
            if (targetId < 0 && !this.currentActiveTag.name)
                return;

            let tagId = targetId < 0 ? this.currentActiveTag.id : targetId;
            let operation = targetId < 0 ? 'delete' : 'add';
            let opts = {
                board_ids_to_add: operation === 'add' ? boardIds : [],
                board_ids_to_delete: operation === 'delete' ? boardIds : [],
                id: tagId
            };

            try {
                // Perform API update
                await this.$fetchApi('/api/board/tags/boards', 'PUT', opts);

                // Client side update
                [this.toastSuccessMsg, this.showSuccessToast] = ['Moved boards!', true];

                let tag = this.getTagById(tagId);
                if (!tag.name) return;

                if (operation === 'add')
                    tag.board_ids = [...new Set(tag.board_ids.concat(boardIds))];
                else if (operation === 'delete') {
                    tag.board_ids = tag.board_ids.filter(i => !boardIds.includes(i));
                    this.boardIdFilter = tag.board_ids;
                }
            } catch (e) {
                let errorMsg = `Failed to edit tag: ${this.$apiErrorToString(e)}`;
                [this.toastErrorMsg, this.showErrorToast] = [errorMsg, true];
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