<template>
    <div>
        <v-sheet
            elevation="0"
            class="pr-3 mb-3 left-nav"
            color="transparent"
            :style="{ left: showNav ? '32px' : '-210px' }"
        >
            <slot></slot>

            <div class="mt-3">
                <NuxtLink to="/board">
                    <div class="pl-2 hoverable hover-list-item left-nav__list-item d-flex">
                        <button class="left-nav__list-item">
                            <v-icon icon="mdi-view-dashboard" /> My Boards
                        </button>
                        <v-spacer />
                    
                        <button
                            class="[ text-center ] hoverable left-nav__board-item-btn"
                            :class="expandSideBoards ? 'left-nav__board-item-btn--expanded' : ''"
                            @click="expandSideBoards = !expandSideBoards;"
                            @click.prevent=""
                        >
                            <v-icon icon="mdi-chevron-up" />
                        </button>
                    </div>
                </NuxtLink>
            
                <div style="max-height: calc(100vh - 300px); overflow-y: auto">
                    <div 
                        class="expand-boards-container" :style="{
                            maxHeight: expandSideBoards ? '2000px' : '0px',
                            overflowY: expandSideBoards ? 'auto' : 'hidden',
                            marginBottom: expandSideBoards ? '8px' : '0px'
                        }"
                    >
                        <NuxtLink v-for="board in boards" :key="board.id" :to="`/board/board?id=${board.id}`">
                            <div
                                class="hoverable hover-list-item left-nav__list-item left-nav__board-item
                                [ pl-3 text-truncate text-medium-emphasis ]"
                            >
                                <v-icon icon="mdi-subdirectory-arrow-right" />{{ board.name }}
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <NuxtLink to="/board?shared_with_me=true">
                    <button class="pl-2 hoverable hover-list-item left-nav__list-item">
                        <v-icon icon="mdi-folder-account" /> Shared With Me
                    </button>
                </NuxtLink>
                <button class="pl-2 mb-4 hoverable hover-list-item left-nav__list-item">
                    <v-icon icon="mdi-star" /> Favorites
                </button>
                <button class="pl-2 hoverable hover-list-item left-nav__list-item">
                    <v-icon icon="mdi-cloud" /> Storage
                </button>
            </div>
        </v-sheet>

        <v-btn
            v-if="isLoggedIn"
            elevation="2" fab small
            :icon="showNav ? 'mdi-chevron-left' : 'mdi-chevron-right'"
            class="toggle-btn"
            :class="!showNav ? 'closed' : ''"

            @click="showNav = !showNav"
        />
    </div>
</template>

<script>
import { useOptionStore } from '~/store/optionStore.js';
import { useBoardStore } from '~/store/boardStore.js';
import { useAuthStore } from '~/store/auth.js';

export default {
    name: 'BoardLeftNav',

    data() {
        return {
            showNav: true,
            boards: useBoardStore(this.$pinia).boards,
            expandSideBoards: useOptionStore(this.$pinia).expand_board_nav
        };
    },
    computed: {
        isLoggedIn() { 
            return useAuthStore(this.$pinia).isLoggedIn;
        }
    },
    watch: {
        expandSideBoards(newVal) {
            useOptionStore(this.$pinia).expand_board_nav = newVal;
        },
        showNav() {
            useOptionStore(this.$pinia).expand_left_nav = this.showNav;
        },
    },
    created() {
        this.getBoards();
        this.showNav = useOptionStore(this.$pinia).expand_left_nav && this.isLoggedIn;
    },
    methods: {
        async getBoards() {
            // Last fetched recently, abort
            // Last fetch is 60 min
            if (Date.now() - useBoardStore(this.$pinia).lastFetch < 1000 * 60)
                return;

            // Get board
            this.boards = [];
            this.loadingBoards = true;
            try {
                let boards = await this.$fetchApi('/api/board/boards', 'GET', {
                    not_self: false,
                    limit: 100,
                    sort_by: 'Name'
                });
                this.boards = boards.boards;
                this.loadingBoards = false;

                useBoardStore(this.$pinia).lastFetch = Date.now();
                useBoardStore(this.$pinia).boards = this.boards;
            } catch (e) {
                this.showErrorToast = true;
                this.toastErrorMsg = 'Failed to get boards: ' + this.$apiErrorToString(e);
                this.loadingBoards = false;
                return;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.toggle-btn {
    position: fixed;
    left: $left-nav-width-pc + 15px;
    top: 50vh;
    transition: left 0.2s;
    z-index: 2;

    width: 24px;
    height: 128px;

    &.closed {
        left: 0;
    }
}

.left-nav {
    border-right: 1px solid $border-color;
    width: $left-nav-width-pc;
    position: fixed;
    top: 72px;
    transition: left 0.2s;
    height: calc(100% - 80px);
    z-index: 1;

    $height: 26px;

    a {
        text-decoration: none;
        color: inherit;
    }

    .expand-boards-container {
        max-height: 70%;
        transition: max-height 0.2s;
    }

    &__list-item {
        height: $menu-item-height;
        user-select: none;
    }

    &__board-item {
        cursor: pointer;
        line-height: $height;
        height: $height;

        a {
            display: block;
            width: 100%;

            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    &__board-item-btn {
        width: 24px;
        height: $height;

        .v-icon {
            transform: rotate(0deg);
            transition: transform 0.2s;
            font-size: 12px;
        }

        &--expanded {
            .v-icon {
                transform: rotate(180deg);
            }
        }
    }
}
</style>
