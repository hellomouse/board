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
                        <button
                            class="px-4 py-2 hoverable hover-list-item"
                            @click="currentPin = {}; editPin = false; createPinModal = true"
                        >
                            <v-icon icon="mdi-format-header-pound" />Markdown Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="createPinModal = true">
                            <v-icon icon="mdi-view-gallery" />Image Gallery Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="createPinModal = true">
                            <v-icon icon="mdi-link" />Link Pin
                        </button>
                        <button class="px-4 py-2 hoverable hover-list-item" @click="createPinModal = true">
                            <v-icon icon="mdi-star-box" />Review Pin
                        </button>
                    </v-sheet>
                </v-menu>
            </BoardLeftNav>

            <v-container class="container pt-0" :style="{ borderRight: `4px solid ${currentBoard.color}` }">

                <!-- TODO: full board name  + desc -->
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

                <div class="grid">
                    <Pin
                        v-for="pin in pins" :key="pin.pin_id"
                        :content="pin.content"
                        :pin-id="pin.pin_id"
                        :creator="pin.creator"
                        :created="pin.created"
                        :edited="pin.edited"
                        :flags="pin.flags"
                        :color="pin.metadata.color"
                        :metadata="pin.metadata"
                        class="mb-1"

                        @update="onPinUpdate"
                    />
                </div>
            </v-container>

            <PinModal
                :edit-mode="editPin"
                :show="createPinModal"
                :pin="currentPin"
                :board-id="currentBoard.id"

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

export default {
    name: 'BoardPage',
    components: { Pin },
    data() {
        return {
            // Board info
            currentUserPerm: '',
            currentBoard: {},

            // Pin info
            currentPin: {},
            initialLoad: true,

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
            selected: 'Created',
            sortDown: true,
            alwaysShowCardDetails: false,
        };
    },
    computed: {
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        }
    },
    // Get board info + pins on page load
    async created() {
        await this.updateBoardInfo();
        await this.updatePins();
    },
    methods: {
        toggleSortDirection() {
            this.sortDown = !this.sortDown;
        },
        async updatePins() {
            try {
                let pins = await this.$fetchApi('/api/board/pins', 'GET', { board_id: this.currentBoard.id });
                for (let pin of pins.pins) {
                    pin.created = this.$formatTimestamp(pin.created);
                    pin.edited = this.$formatTimestamp(pin.edited);
                }
                this.pins = pins.pins;
            } catch (e) {
                console.log(e)
                // TODO: error state
            }
        },
        async updateBoardInfo() {
            try {
                let board = await this.$fetchApi('/api/board/boards/single', 'GET', { id: this.$route.query.id });
                this.currentBoard = board;
                this.currentBoard.title = board.name; // Alias
                this.currentUserPerm = board.perms[useAuthStore(this.$pinia).user.id]?.perm_level || '';
            } catch(e) {
                console.log(e)
                // TODO: error state
            }
        },
        // Called when a pin is newly created or cancelled
        async onPinCreate(created) {
            this.createPinModal = false;
            if (created) {
                [this.showSuccessToast, this.toastSuccessMsg] = [true,
                    this.editPin ? 'Pin edited!' : 'Pin created!'];
                this.updatePins();
            }
        },
        // Pin option (such as edit / delete) triggered
        async onPinUpdate(update) {
            if (update.type === 'pin_delete') // Pin was just deleted
                await this.updatePins();
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
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/dropdown-menu.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
    margin-left: $left-nav-width-pc;
}

.subtitle { opacity: $secondary-text-opacity; }

.grid {
    columns: 270px 5;
    column-gap: 5px;

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
