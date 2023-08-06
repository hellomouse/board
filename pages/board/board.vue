<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
});
</script>

<template>
    <!-- A page to show pins within a single board -->
    <div>
        <NuxtLayout name="board">
            <BoardLeftNav>
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn
                            color="green" block
                            height="44" v-bind="props"
                        >
                            <v-icon icon="mdi-plus" /> New Pin
                        </v-btn>
                    </template>
                
                    <v-sheet elevation="8" rounded="0">
                        <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(0)">
                            <v-icon icon="mdi-format-header-pound" />Markdown Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(1)">
                            <v-icon icon="mdi-view-gallery" />Image Gallery Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(2)">
                            <v-icon icon="mdi-link" />Link Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="openCreatePin(3)">
                            <v-icon icon="mdi-star-box" />Review Pin
                        </button>
                    </v-sheet>
                </v-menu>
            </BoardLeftNav>

            <v-container class="container-with-left-nav pt-0" :style="{ borderRight: `4px solid ${currentBoard.color}` }">
                <div v-if="initialLoad" class="state-loader state-center">
                    <v-progress-linear color="primary" indeterminate class="mb-2" />
                    Loading Pins...
                </div>

                <div v-if="pins.length === 0 && !initialLoad && !errorState" class="state-center empty-state">
                    <img src="/empty-state-board.png" width="200">
                    <h1>This board has no pins</h1>
                    <p>Press the 'New Pins' button on the left to create one</p>
                </div>

                <div v-if="errorState" class="state-center">
                    <img src="/error-state.png" width="200">
                    <h1>Could not get board</h1>
                    <p class="mb-4">Board does not exist or you do not have permission to view</p>
                    <NuxtLink to="/board" style="text-decoration: none !important">
                        <v-btn color="primary">Go back to my boards</v-btn>
                    </NuxtLink>
                </div>

                <div v-if="!errorState && !initialLoad">
                    <h1>
                        <v-menu>
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
                                    @click="boardPropertiesModal = true"
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

                        {{ currentBoard.name }}
                    </h1>

                    <div class="d-flex">
                        <p
                            class="ml-11 subtitle text-truncate"
                            style="vertical-align: top; margin-right: auto; margin-left: 0"
                        >{{ currentBoard.desc }}</p>

                        <!-- Sort options -->
                        <div class="[ small-container ] mb-2 d-inline-flex flex-direction-row justify-end">
                            <v-select
                                v-model="selected" density="compact" solo-filled max-width="200"
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

                <div class="grid">
                    <Pin
                        v-for="pin in pins" :key="pin.pin_id"
                        :content="pin.content"
                        :pin-id="pin.pin_id"
                        :creator="pin.creator"
                        :created="pin.created"
                        :edited="pin.edited"
                        :initial-flags="pin.flags"
                        :color="pin.metadata.color"
                        :metadata="pin.metadata"
                        :perm="currentUserPerm"
                        :always-show-details="alwaysShowCardDetails"
                        class="mb-1"

                        @update="onPinUpdate"
                    />
                </div>

                <v-pagination
                    v-if="pageCount > 1 && !initialLoad && !errorState"
                    v-model="page" class="mt-4"
                    :length="pageCount" total-visible="5"
                />
            </v-container>

            <PinModal
                :edit-mode="editPin"
                :show="createPinModal"
                :pin="currentPin"
                :pin-title="pinTitle"
                :board-id="currentBoard.id || ''"

                @update="onPinCreate"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            />

            <!-- For current board -->
            <v-dialog
                v-model="boardPropertiesModal"
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
                        <v-btn color="primary" block @click="boardPropertiesModal = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
      
            <BoardModal
                :edit-mode="true"
                :show="editBoardModal"
                :board="currentBoard"

                @update="onBoardEdit"
                @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            />

            <BoardDeleteModal
                :show="deleteBoardModal"
                :board="currentBoard"

                @update="onBoardDeleteUpdate"
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
    </div>
</template>

<script>
import Pin from '~/components/pin/Pin.vue';
import { useAuthStore } from '~/store/auth.js';
import { useOptionStore } from '~/store/optionStore.js';

const PINS_PER_PAGE = 40;

export default {
    name: 'BoardPage',
    components: { Pin },
    data() {
        return {
            // Board info
            currentUserPerm: '',
            currentBoard: {},
            errorState: false,
            initialLoad: true,
            viewerHasPerm: false,
            unwatch: () => {},

            pinCount: 0,
            pageCount: 0,
            page: 1,
            pinTitle: '',

            // Pin info
            currentPin: {},

            // Modal show
            editBoardModal: false,
            shareBoardModal: false,
            deleteBoardModal: false,
            boardPropertiesModal: false,

            // Data
            pins: [],

            // Modal show
            editPin: false,
            createPinModal: false,

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
                false : useOptionStore(this.$pinia).always_show_pin_details
        };
    },
    computed: {
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        }
    },
    watch: {
        selected() {
            useOptionStore(this.$pinia).sort_pins[0] = this.selected;
        },
        sortDown() {
            useOptionStore(this.$pinia).sort_pins[1] = this.sortDown;
        },
        alwaysShowCardDetails() {
            useOptionStore(this.$pinia).always_show_pin_details = this.alwaysShowCardDetails;
        }
    },
    // Get board info + pins on page load
    async created() {
        await this.onLoad();
        this.$watch('$route.query', this.onLoad);
    },
    methods: {
        async onLoad() {
            this.initialLoad = true;
            await this.updateBoardInfo();
            await this.updatePins();

            this.unwatch();
            this.page = this.$route.query.page || 1;
            this.unwatch = this.$watch('page', this.pageWatch);
            this.initialLoad = false;
        },
        toggleSortDirection() {
            this.sortDown = !this.sortDown;
        },
        async updatePins() {
            try {
                let pins = await this.$fetchApi('/api/board/pins', 'GET', {
                    board_id: this.currentBoard.id,
                    offset: (this.page - 1) * PINS_PER_PAGE,
                    limit: PINS_PER_PAGE
                });
                for (let pin of pins.pins) {
                    pin.created = this.$formatTimestamp(pin.created);
                    pin.edited = this.$formatTimestamp(pin.edited);
                }
                this.pins = pins.pins;
            } catch (e) {
                [this.toastErrorMsg, this.showErrorToast] = ['Failed to get pins: ' + this.$apiErrorToString(e), true];
            }
        },
        async updateBoardInfo() {
            try {
                let board = await this.$fetchApi('/api/board/boards/single', 'GET', { id: this.$route.query.id });
                this.currentBoard = board;
                this.currentUserPerm = board.perms[useAuthStore(this.$pinia).user.id]?.perm_level || '';
                this.pinCount = board.pin_count;
                this.pageCount = Math.ceil(board.pin_count / PINS_PER_PAGE);
            } catch(e) {
                console.error(e);
                this.errorState = true;
                this.initialLoad = false;
            }
        },
        // Called when a pin is newly created or cancelled
        async onPinCreate(created) {
            this.createPinModal = false;
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
                this.createPinModal = true;
            }
        },

        // Board stuff:
        // Handle menu selection for each board
        openBoardDeleteModal() {
            this.deleteBoardModal = true;
        },
        openBoardEditModal() {
            this.editBoardModal = true;
        },
        async openBoardShareModal() {
            await this.updateBoardInfo(); // Sync information before opening
            this.shareBoardModal = true;
        },
        async onBoardDeleteUpdate(msg) {
            if (msg.type === 'close_board_delete') // Close board delete modal
                this.deleteBoardModal = false;
            else if (msg.type === 'board_delete') { // Board was deleted
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Board deleted!'];
                setTimeout(() => {
                    this.$router.push('/board');
                }, 2000);
            }
        },
        // Called when a board is newly created or cancelled
        async onBoardEdit(edited) {
            this.editBoardModal = false;
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
            history.pushState({}, null,
                this.$route.path + '?' + new URLSearchParams({
                    id: this.currentBoard.id,
                    page: this.page
                }));
            this.updatePins();
        },
        // Left create pin dropdown
        openCreatePin(type) {
            this.currentPin = { type };
            this.editPin = false;
            this.createPinModal = true
            this.pinTitle = ['Markdown', 'Image Gallery', 'Link', 'Review'][type] || '';
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/dropdown-menu.scss";
@import "~/assets/css/state.scss";

.subtitle { opacity: $secondary-text-opacity; }

.grid {
    columns: 270px 5;
    column-gap: 5px;
    min-height: calc(100% - 200px);

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
