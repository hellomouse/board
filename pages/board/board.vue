<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
});

// eslint-disable-next-line no-undef
useSeoMeta({
    ogImage: '/logos/meta/board.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <!-- A page to show pins within a single board -->
    <NuxtLayout name="board">
        <Title>{{ pageTitle }}</Title>
        <Meta name="og:title" :content="pageTitle" />
        <Meta name="description" :content="pageDescription" />
        <Meta name="og:description" :content="pageDescription" />

        <v-toolbar class="bulk-pin-edits" color="grey-darken-4" :style="{ top: selectedPins.size ? '0px' : '-100px' }">
            <v-btn icon="mdi-close" @click="deselectAllPins" />
            <h1>{{ selectedPins.size }} Selected</h1>
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
                    <pin-palette
                        :selected-swatch-index="selectedSwatchIndex"
                        @color="massColorChange"
                    />
                </v-sheet>
            </v-menu>

            <v-tooltip :text="allSelectedPinsAreFavorited ? 'Unfavorite' : 'Favorite'" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        :icon="allSelectedPinsAreFavorited ? 'mdi-star-off' : 'mdi-star'"
                        @click="bulkFavorite()"
                    />
                </template>
            </v-tooltip>

            <v-tooltip :text="allSelectedPinned ? 'Unpin' : 'Pin'" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        :icon="allSelectedPinned ? 'mdi-pin-off' : 'mdi-pin'"
                        @click="bulkModifyPins('PINNED')"
                    />
                </template>
            </v-tooltip>

            <v-tooltip :text="allSelectedLocked ? 'Unlock' : 'Lock'" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        :icon="allSelectedLocked ? 'mdi-lock-open' : 'mdi-lock'"
                        @click="bulkModifyPins('LOCKED')"
                    />
                </template>
            </v-tooltip>

            <v-tooltip :text="allSelectedArchived ? 'Unarchive' : 'Archive'" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        :icon="allSelectedArchived ? 'mdi-folder-off' : 'mdi-folder-zip'"
                        @click="bulkModifyPins('ARCHIVED')"
                    />
                </template>
            </v-tooltip>

            <v-tooltip text="Delete" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-trash-can" color="red"
                        @click="deleteDialog = true"
                    />
                </template>
            </v-tooltip>
        </v-toolbar>

        <v-dialog
            v-model="deleteDialog"
            width="350"
        >
            <v-card rounded="0">
                <v-card-text>
                    Are you sure you want to <b>permanently</b> delete {{ selectedPins.size }} pin(s)? This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="deleteSelectedPins">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <BoardLeftNav>
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        color="green" block
                        height="44" v-bind="props"
                        :disabled="isFavoritesPage"
                    >
                        <v-icon icon="mdi-plus" :style="{ opacity: isFavoritesPage ? 0.4 : 1 }"/> New Pin
                    </v-btn>
                </template>
            
                <v-sheet elevation="8" rounded="0">
                    <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(0)">
                        <v-icon icon="mdi-format-header-pound" />Rich Text Pin
                    </button>
                    <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(3)">
                        <v-icon icon="mdi-text-box-check" />Checklist Pin
                    </button>
                    <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(1)">
                        <v-icon icon="mdi-view-gallery" />Image Gallery Pin
                    </button>
                    <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(2)">
                        <v-icon icon="mdi-link" />Link Pin
                    </button>
                </v-sheet>
            </v-menu>
        </BoardLeftNav>

        <v-container 
            :class="containerClass"
            class="container-with-left-nav pt-0"
            :style="{ borderRight: `4px solid ${currentBoard.color}` }"
        >
            <div v-if="initialLoad" class="state-loader state-center">
                <v-progress-linear color="primary" indeterminate class="mb-2" />
                Loading Pins...
            </div>

            <div v-if="pins.length === 0 && !initialLoad && !errorState" class="state-center empty-state">
                <img src="/empty-state-board.png" width="200">
                <h1>This board has no pins</h1>
                <p>{{ isFavoritesPage ? 'Favorite some pins to get started' : 'Press the \'New Pins\' button on the left to create one' }}</p>
            </div>

            <div v-if="errorState" class="state-center">
                <img src="/error-state.png" width="200">
                <h1>Could not get board</h1>
                <p class="mb-4">Board does not exist or you do not have permission to view</p>
                <NuxtLink to="/board" style="text-decoration: none !important">
                    <v-btn color="primary">Go back to my boards</v-btn>
                </NuxtLink>
            </div>

            <div v-if="!errorState && !initialLoad && !isSinglePin" @click="deselectAllPins()">
                <h1>
                    <v-menu v-if="!isFavoritesPage">
                        <template #activator="{ props }">
                            <v-btn
                                density="comfortable"
                                icon="mdi-dots-vertical"
                                v-bind="props"
                                class="board-tile__menu d-inline-block"
                                flat color="transparent"
                            ></v-btn>
                        </template>
                
                        <v-sheet elevation="8" rounded="0">
                            <button class="px-4 hoverable hover-list-item edit-list-item" @click="copyBoardShareLink">
                                <v-icon icon="mdi-link" />Permalink
                            </button>
                            <button
                                class="px-4 [ hoverable hover-list-item ] [ edit-list-item ]"
                                @click="modals.boardPropertiesModal = true"
                            >
                                <v-icon icon="mdi-information-outline" />Properties
                            </button>
                            <button
                                v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                                class="px-4 hoverable hover-list-item edit-list-item"
                                @click="openBoardShareModal"
                            >
                                <v-icon icon="mdi-account-plus" />Share
                            </button>
                            <button
                                v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                                class="px-4 hoverable hover-list-item edit-list-item"
                                @click="openBoardEditModal"
                            >
                                <v-icon icon="mdi-pencil" />Edit
                            </button>
                            <button
                                v-if="['Owner'].includes(currentUserPerm)"
                                class="px-4 text-red [ hoverable hover-list-item ] [ edit-list-item edit-list-item--line ]"
                                @click="openBoardDeleteModal"
                            >
                                <v-icon icon="mdi-trash-can" color="red" />Delete
                            </button>
                        </v-sheet>
                    </v-menu>

                    {{ currentBoard.name }}{{ $route.query.search ? ' - Search Results' : '' }}
                </h1>

                <div class="d-flex">
                    <p
                        class="subtitle text-truncate"
                        :class="!isFavoritesPage ? 'ml-11' : ''"
                        style="vertical-align: top; margin-right: auto; margin-left: 0"
                    >{{ currentBoard.desc }}</p>

                    <!-- Sort options -->
                    <div class="[ small-container ] mb-2 d-inline-flex flex-direction-row justify-end">
                        <v-select
                            v-model="selected" density="compact" solo-filled max-width="200"
                            flat class="select mr-2"
                            :items="['Created', 'Edited']"
                        ></v-select>

                        <v-btn
                            icon variant="text"
                            height="40"
                            @click="toggleSortDirection"
                        >
                            <v-icon class="sort-arrow-down" :class="downArrowClass">mdi-arrow-up</v-icon>
                        </v-btn>

                        <v-menu :close-on-content-click="false">
                            <template #activator="{ props }">
                                <v-btn
                                    icon variant="text"
                                    height="40"
                                    v-bind="props"
                                >
                                    <v-icon>mdi-cog</v-icon>
                                </v-btn>
                            </template>
                            <v-sheet color="background-light" elevation="8" rounded="0" class="px-4 py-1">
                                <v-switch v-model="alwaysShowCardDetails" color="red" label="Always show pin details"></v-switch>
                            </v-sheet>
                        </v-menu>
                    </div>
                </div>
            </div>

            <div :class="[isSinglePin ? 'single-pin-grid' : 'grid', specialGridClass]" @click.self="deselectAllPins()">
                <lazy-Pin
                    v-for="pin in pins" :key="pin.pin_id"
                    :content="pin.content"
                    :pin-id="pin.pin_id"
                    :board-id="pin.board_id"
                    :type="pin.pin_type"
                    :creator="pin.creator"
                    :created="pin.created"
                    :edited="pin.edited"
                    :initial-flags="pin.flags"
                    :initial-selected="pin.selected"
                    :color="pin.metadata.color"
                    :metadata="pin.metadata"
                    :perm="currentUserPerm"
                    :always-show-details="alwaysShowCardDetails"
                    :deselect-trigger="deselectTrigger"
                    :select-trigger="selectTrigger"
                    :initial-favorited="pin.favorited"
                    style="margin-bottom: 10px"

                    @update="onPinUpdate"
                    @success="msg => { [this.showSuccessToast, this.toastSuccessMsg] = [true, msg]; }"
                    @select="updateSelected"
                    @flagsUpdate="updatePinFlags"
                />
            </div>

            <v-pagination
                v-if="pageCount > 1 && !initialLoad && !errorState"
                v-model="page" class="mt-4"
                :length="pageCount" total-visible="5"
            />
        </v-container>

        <lazy-pin-modal
            v-if="!isFavoritesPage"

            :edit-mode="editPin"
            :show="modals.createPinModal"
            :pin="currentPin"
            :pin-title="pinTitle"
            :board-id="currentBoard.id || ''"

            @update="onPinCreate"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
        />

        <!-- For current board -->
        <v-dialog
            v-model="modals.boardPropertiesModal"
            width="auto"
        >
            <v-card width="500">
                <v-card-text>
                    <div :style="{ borderBottom: `2px solid ${currentBoard.color}` }" class="mb-2 pb-2">
                        <h1>{{ currentBoard.name }}</h1>
                        <span class="subtitle">Created by {{ currentBoard.creator }}</span>
                    </div>
                    <p class="board-desc">{{ currentBoard.desc }}</p>

                    <br>
                    <code class="board-properties"><div class="board-properties__prop">ID:</div> {{ currentBoard.id }}</code><br>
                    <code class="board-properties">
                        <div class="board-properties__prop">Created:</div>
                        {{ $formatTimestamp(currentBoard.created) }}
                    </code><br>
                    <code class="board-properties">
                        <div class="board-properties__prop">Edited:</div>
                        {{ $formatTimestamp(currentBoard.edited) }}
                    </code><br>
                    <code class="board-properties">
                        <div class="board-properties__prop">Pins:</div>
                        {{ currentBoard.pin_count }}
                    </code>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" block @click="modals.boardPropertiesModal = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    
        <lazy-board-modal
            v-if="!isFavoritesPage"

            :edit-mode="true"
            :show="modals.editBoardModal"
            :board="currentBoard"
            :active-tag-id="-1"

            @update="onBoardEdit"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
        />

        <lazy-board-delete-modal
            v-if="!isFavoritesPage"

            :show="modals.deleteBoardModal"
            :board="currentBoard"

            @update="onBoardDeleteUpdate"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
        />

        <lazy-board-share-modal
            v-if="!isFavoritesPage"
    
            :show="modals.shareBoardModal"
            :board="currentBoard"

            @update="e => { if (e.type === 'close') modals.shareBoardModal = false; }"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
        />

        <lazy-pin-history-modal
            :pin="pinHistoryModalPin"
            :show="modals.pinHistoryModal"

            @update="onPinHistoryUpdate"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
        />

        <lazy-pin-copy-to-board-modal
            :show="modals.pinCopyToBoardModal"
            :pin="pinCopyToBoardPin"

            @update="e => { if (e.type === 'close') modals.pinCopyToBoardModal = false; }"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
        />

        <!-- Toasts for errors / success -->
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
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { useOptionStore } from '~/store/optionStore.js';

const PINS_PER_PAGE = 40;

export default {
    name: 'BoardPage',
    data() {
        return {
            // Board info
            currentUserPerm: '',
            currentBoard: {},
            errorState: false,
            initialLoad: true,
            viewerHasPerm: false,
            isSinglePin: false,
            isFavoritesPage: false,
            unwatch: () => {},

            pinCount: 0,
            pageCount: 0,
            page: 1,
            pinTitle: '',

            // Pin info
            currentPin: {},

            // Modal show
            modals: {
                editBoardModal: false,
                shareBoardModal: false,
                deleteBoardModal: false,
                boardPropertiesModal: false,
                pinHistoryModal: false,
                createPinModal: false,
                pinCopyToBoardModal: false
            },

            // Whether in edit mode
            editPin: false,

            // Data
            pins: [],

            // Toasts
            showErrorToast: false,
            showSuccessToast: false,
            toastErrorMsg: '',
            toastSuccessMsg: '',

            // Sorting
            selected: useOptionStore(this.$pinia).sort_pins[0] === undefined ?
                'Created' : useOptionStore(this.$pinia).sort_pins[0],
            sortDown: useOptionStore(this.$pinia).sort_pins[1] === undefined ?
                true : useOptionStore(this.$pinia).sort_pins[1],
            alwaysShowCardDetails: useOptionStore(this.$pinia).always_show_pin_details === undefined ?
                false : useOptionStore(this.$pinia).always_show_pin_details,
            
            // Meta
            pageTitle: 'Hellomouse Board',
            pageDescription: 'Default board description',

            // Pin selection
            selectedPins: new Set(),
            deselectTrigger: false,   // When this updates all pins are deselected
            selectTrigger: false,     // When this updates all pins are selected
            deleteDialog: false,
            selectedSwatchIndex: 0,

            // History and copy modal
            pinHistoryModalPin: {},
            pinCopyToBoardPin: {}
        };
    },
    computed: {
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        },
        containerClass() {
            return useOptionStore(this.$pinia).expand_left_nav ? '' : 'sidenav-hidden';
        },

        // Special cases for grid if not enough pins to fill columns
        specialGridClass() {
            if (this.pins.length === 1) return 'grid--1';
            if (this.pins.length === 2) return 'grid--2';
            if (this.pins.length === 3) return 'grid--3';
            if (this.pins.length === 4) return 'grid--4';
            return '';
        },

        allSelectedPinned() { return this.doAllSelectedPinsHaveFlags('PINNED'); },
        allSelectedLocked() { return this.doAllSelectedPinsHaveFlags('LOCKED'); },
        allSelectedArchived() { return this.doAllSelectedPinsHaveFlags('ARCHIVED'); },

        allSelectedPinsAreFavorited() {
            for (let pin of this.pins) {
                if (this.selectedPins.has(pin.pin_id) && !pin.favorited)
                    return false;
            }
            return true;
        }
    },
    watch: {
        selected() {
            useOptionStore(this.$pinia).sort_pins[0] = this.selected;
            this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, sort: this.selected } });
            this.updatePins();
        },
        sortDown() {
            useOptionStore(this.$pinia).sort_pins[1] = this.sortDown;
            this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, sort_down: this.sortDown } });
            this.updatePins();
        },
        alwaysShowCardDetails() {
            useOptionStore(this.$pinia).always_show_pin_details = this.alwaysShowCardDetails;
        },
        '$route.path'() {
            if (this.$route.path !== '/board/board' && process.client)
                document.removeEventListener('keydown', this.keydownHandler);
        }
    },
    mounted() {
        if (process.client)
            document.addEventListener('keydown', this.keydownHandler);
    },
    destroyed() {
        if (process.client)
            document.removeEventListener('keydown', this.keydownHandler);
    },
    // Get board info + pins on page load
    async created() {
        await this.onLoad();
        this.$watch('$route.query', () => {
            if (this.$route.path !== '/board/board') return;
            this.deselectAllPins();
            this.onLoad();
        });
    },
    methods: {
        async onLoad() {
            if (this.$route.path !== '/board/board') return; // Navigated to another page

            if (this.$route.query.sort)
                this.selected = this.$route.query.sort;
            if (this.$route.query.sort_down)
                this.sortDown = this.$route.query.sort_down === 'true';

            this.isFavoritesPage = this.$route.query.favorites !== undefined;
            this.isSinglePin = this.$route.query.pin_id && this.$route.query.pin_id.length;
            this.pins = [];
            this.initialLoad = true;

            if (!this.isSinglePin) {
                await this.updateBoardInfo();
                await this.updatePins();

                this.unwatch();
                this.page = this.$route.query.page || 1;
                this.unwatch = this.$watch('page', this.pageWatch);
            } else {
                try {
                    let opts = {
                        id: this.$route.query.pin_id,
                        sort_by: this.selected,
                        sort_down: this.sortDown
                    };
                    let pins = await this.$fetchApi('/api/board/pins/single', 'GET', opts);
                    pins = [pins];
                    for (let pin of pins) {
                        pin.created = this.$formatTimestamp(pin.created);
                        pin.edited = this.$formatTimestamp(pin.edited);
                    }
                    this.pins = pins;

                    this.pageTitle = `Hellomouse Board - Pin`;
                    this.pageDescription = this.pins[0].content.replace(/(<([^>]+)>)/gi, '') || 'No description provided';
                } catch (e) {
                    [this.toastErrorMsg, this.showErrorToast] = ['Failed to get pin: ' + this.$apiErrorToString(e), true];
                }
            }
            this.initialLoad = false;
        },
        toggleSortDirection() {
            this.sortDown = !this.sortDown;
        },
        async updatePins() {
            try {
                let opts = {
                    board_id: this.currentBoard.id,
                    offset: (this.page - 1) * PINS_PER_PAGE,
                    limit: PINS_PER_PAGE,
                    sort_by: this.selected,
                    sort_down: this.sortDown
                };

                if (this.$route.query.search && this.$route.query.search.length > 3)
                    opts.query = this.$route.query.search;
                if (opts.query)
                    opts = this.$processSearchParams(opts, 'creator');
                if (this.isFavoritesPage) {
                    delete opts.query;
                    delete opts.board_id;
                }

                let url = this.isFavoritesPage ? '/api/board/pins/favorites' : '/api/board/pins';
                let pins = await this.$fetchApi(url, 'GET', opts);

                // Check which pins are favorited if not favorites page (favorites page all are favorited)
                if (!this.isFavoritesPage) {
                    let that = this;
                    setTimeout(async () => {
                        let pins = await that.$fetchApi('/api/board/pins/favorites/check', 'POST', {
                            pin_ids: that.pins.map(p => p.pin_id)
                        });
                        pins = pins.pins;
                        for (let pin of that.pins) {
                            if (pins.includes(pin.pin_id))
                                pin.favorited = true;
                        }
                    }, 200);
                }

                for (let pin of pins.pins) {
                    pin.created = this.$formatTimestamp(pin.created);
                    pin.edited = this.$formatTimestamp(pin.edited);

                    if (this.isFavoritesPage)
                        pin.favorited = true;
                }
                this.pins = pins.pins;

                // Favorites page: if current page is full then assume page count is infinite
                if (this.isFavoritesPage)
                    this.pageCount = this.pins.length >= PINS_PER_PAGE ? this.page + 1 : 1;
            } catch (e) {
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to get pins: ' + this.$apiErrorToString(e), true];
            }
        },
        async updateBoardInfo() {
            if (this.isFavoritesPage) {
                this.currentBoard = {
                    name: 'Favorites',
                    desc: 'Your favorite pins are shown here',
                    color: '#FDD835'
                };
                this.pageTitle = `Hellomouse Board - ${this.currentBoard.name}`;
                this.pageDescription = this.currentBoard.desc;
                return;
            }

            try {
                let board = await this.$fetchApi('/api/board/boards/single', 'GET', { id: this.$route.query.id });
                this.currentBoard = board;
                this.currentUserPerm = board.perms[useAuthStore(this.$pinia).user.id]?.perm_level || '';
                this.pinCount = board.pin_count;
                this.pageCount = Math.ceil(board.pin_count / PINS_PER_PAGE);

                this.pageTitle = `Hellomouse Board - ${this.currentBoard.name}`;
                this.pageDescription = this.currentBoard.desc;
            } catch(e) {
                console.error(e);
                this.errorState = true;
                this.initialLoad = false;
            }
        },
        // Called when a pin is newly created or cancelled
        async onPinCreate(created) {
            // The pin drag component emits the same event name :/
            if (created.isTrusted !== undefined)
                return;

            this.modals.createPinModal = false;
            if (created) {
                this.pinCount++;
                this.pageCount = Math.ceil(this.pinCount / PINS_PER_PAGE);

                [this.showSuccessToast, this.toastSuccessMsg] = [true,
                    this.editPin ? 'Pin edited!' : 'Pin created!'];
                this.updatePins();
            }
        },
        // Pin option (such as edit / delete) triggered
        async onPinUpdate(update) {
            if (update.type === 'pin_delete') { // Pin was just deleted
                this.pinCount--;
                this.pageCount = Math.ceil(this.pinCount / PINS_PER_PAGE);
                await this.updatePins();
            }
            else if (update.type === 'pin-edit') { // Edit current pin
                this.editPin = true;
                this.currentPin = update.pin;
                this.modals.createPinModal = true;
            }
            else if (update.type === 'pin-favorite') {
                for (let pin of this.pins) {
                    if (pin.pin_id === update.id) {
                        pin.favorited = update.favorited;
                        break;
                    }
                }
            }
            else if (update.type === 'content') {
                for (let pin of this.pins) {
                    if (pin.pin_id === update.id) {
                        pin.content = update.content;
                        break;
                    }
                }
            }
            else if (update.type === 'pin-history') {
                this.pinHistoryModalPin = update.pin;
                this.modals.pinHistoryModal = true;
            }
            else if (update.type === 'pin-copy-to-board') {
                this.pinCopyToBoardPin = update.pin;
                this.modals.pinCopyToBoardModal = true;
            }
        },

        // Board stuff:
        // Handle menu selection for each board
        openBoardDeleteModal() {
            this.modals.deleteBoardModal = true;
        },
        openBoardEditModal() {
            this.modals.editBoardModal = true;
        },
        async openBoardShareModal() {
            this.modals.shareBoardModal = true;
            await this.updateBoardInfo(); // Sync information before opening
        },
        async onBoardDeleteUpdate(msg) {
            if (msg.type === 'close_board_delete') // Close board delete modal
                this.modals.deleteBoardModal = false;
            else if (msg.type === 'board_delete') { // Board was deleted
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board deleted!'];
                setTimeout(() => {
                    this.$router.push('/board');
                }, 2000);
            }
        },
        // Called when a board is newly created or cancelled
        async onBoardEdit(edited) {
            this.modals.editBoardModal = false;
            if (edited) {
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board edited!'];
                this.updateBoardInfo();
            }
        },
        copyBoardShareLink() {
            if (process.client)
                navigator.clipboard.writeText(window.location.origin + '/board/board?id=' + this.currentBoard.id);
            [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Link copied!'];
        },
        // On page change
        pageWatch(page) {
            this.page = page;
    
            let params = { page: this.page };
            if (this.isFavoritesPage) params.favorites = '1';
            else params.id = this.currentBoard.id;

            history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(params));
            this.updatePins();

            // Favorites board has infinite pages
            if (this.isFavoritesPage)
                this.pageCount = this.pins.length ? page : page + 1;
        },
        // Left create pin dropdown
        openCreatePin(type) {
            this.currentPin = { type };
            this.editPin = false;
            this.modals.createPinModal = true
            this.pinTitle = ['Rich Text', 'Image Gallery', 'Link', 'Review', 'Checklist'][type] || '';
        },
        // On pin select / deselect
        updateSelected(update) {
            if (update.selected)
                this.selectedPins.add(update.id);
            else
                this.selectedPins.delete(update.id);
        },
        deselectAllPins() {
            this.pins.forEach(p => p.selected = false);
            this.deselectTrigger = !this.deselectTrigger; // Change triggers deselect for all pins
            this.selectedPins.clear();
        },
        selectAllPins() {
            this.pins.forEach(p => p.selected = true);
            this.selectTrigger = !this.selectTrigger;
            this.selectedPins = new Set(this.pins.map(x => x.pin_id));
        },
        // Bulk modify pins
        doAllSelectedPinsHaveFlags(flag) {
            for (let pin of this.pins) {
                if (this.selectedPins.has(pin.pin_id) && !pin.flags.split(' | ').includes(flag))
                    return false;
            }
            return true;
        },
        async bulkModifyPins(flag) {
            try {
                let addFlags = !this.doAllSelectedPinsHaveFlags(flag);
                let opts = {
                    pin_ids: [...this.selectedPins],
                    new_flags: flag,
                    add_flags: addFlags
                };
                await this.$fetchApi('/api/board/pins/bulk_flags', 'PUT', opts);

                for (let pin of this.pins) {
                    if (this.selectedPins.has(pin.pin_id)) {
                        let flags = pin.flags.split(' | ');
                        if (addFlags && !flags.includes(flag))
                            flags.push(flag);
                        else if (!addFlags && flags.includes(flag))
                            flags = flags.filter(f => f !== flag);
                        pin.flags = flags.filter(x => x).join(' | ');
                    }
                }
            } catch (e) {
                console.error(e);
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to modify pins: ' + this.$apiErrorToString(e), true];
            }
            this.deselectAllPins();
        },
        async deleteSelectedPins() {
            try {
                let opts = { pin_ids: [...this.selectedPins] };
                await this.$fetchApi('/api/board/pins/bulk_delete', 'DELETE', opts);
                this.pins = this.pins.filter(p => !this.selectedPins.has(p.pin_id));
            } catch (e) {
                console.error(e);
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to modify pins: ' + this.$apiErrorToString(e), true];
            }
            this.deleteDialog = false;
            this.deselectAllPins();
        },
        // Called when pin changes its flag data
        updatePinFlags(update) {
            for (let pin of this.pins) {
                if (pin.pin_id === update.id) {
                    pin.flags = update.flags;
                    break;
                }
            }
        },
        // Called for favoriting / unfaving a lot of pins
        async bulkFavorite() {
            try {
                let addFav = !this.allSelectedPinsAreFavorited;
                let opts = { pin_ids: [...this.selectedPins] };
                await this.$fetchApi('/api/board/pins/favorites', addFav ? 'PUT' : 'DELETE', opts);

                for (let pin of this.pins) {
                    if (this.selectedPins.has(pin.pin_id))
                        pin.favorited = addFav;
                }
            } catch (e) {
                console.error(e);
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to (un)favorite pins: ' + this.$apiErrorToString(e), true];
            }
            this.deselectAllPins();
        },
        // Bulk modify pin color
        async massColorChange(update) {
            this.selectedSwatchIndex = update.index;

            try {
                let opts = { pin_ids: [...this.selectedPins], color: update.color };
                await this.$fetchApi('/api/board/pins/bulk_colors', 'PUT', opts);
                
                for (let pin of this.pins) {
                    if (this.selectedPins.has(pin.pin_id)) {
                        pin.metadata.color = update.color;
                        pin.selected = true;
                    }
                }
            } catch (e) {
                console.error(e);
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to modify pins: ' + this.$apiErrorToString(e), true];
            }
        },
        // Pin history
        onPinHistoryUpdate(e) {
            if (e.type === 'close')
                this.modals.pinHistoryModal = false;
            else if (e.type === 'pin-content') {
                for (let pin of this.pins) {
                    if (pin.pin_id === e.id) {
                        let history = e.history;
                        pin.content = history.content;
                        pin.metadata = history.metadata;
                        pin.attachment_paths = history.attachment_paths;
                        pin.flags = history.flags;
                        break;
                    }
                }
            }
        },
        // Selection keyboard
        keydownHandler(event) {
            // Ctrl-A select all pins when no modal is open
            if (event.ctrlKey && event.key === 'a' && !Object.keys(this.modals).some(x => x)) {
                event.preventDefault();
                this.selectAllPins();
                return false;
            }
            return true;
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/dropdown-menu.scss";
@import "~/assets/css/state.scss";

.subtitle { opacity: $secondary-text-opacity; }

.bulk-pin-edits {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1999;
}

.single-pin-grid {
    max-width: 370px;
    margin: 0 auto;
    padding-top: 64px;

    & > * {
        width: 100%;
    }
}

.grid {
    columns: 300px auto;
    column-gap: 10px;
    min-height: calc(100% - 200px);

    // Special cases when number of pins can't fill columns
    &.grid--1 {
        columns: unset;
        max-width: 370px;
    }
     &.grid--2 {
        columns: 270px 2;
        max-width: 600px;
    }
     &.grid--3 {
        columns: 270px 3;
        max-width: 900px;
    }
     &.grid--4 {
        columns: 270px 4;
        max-width: 1200px;
    }

    & > * {
        width: 100%;
    }
}

// Board properties modal
.board-properties {
    color: rgb(var(--v-theme-on-surface), $secondary-text-opacity);

    &__prop {
        width: 70px;
        display: inline-block;
        color: rgb(var(--v-theme-primary));
        font-weight: bold;
    }
}

.board-desc {
    white-space: pre;
    max-height: 300px;
    overflow-y: auto;
}
</style>
