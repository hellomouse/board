<template>
    <v-sheet
        elevation="0"
        class="pr-3 mb-3 left-nav"
        color="transparent"
    >
        <slot></slot>

        <div class="mt-3">
            <div class="pl-2 hoverable hover-list-item left-nav__list-item">
                <NuxtLink to="/board" class="d-flex">
                    <button class="left-nav__list-item">
                        <v-icon icon="mdi-view-dashboard" /> My Boards
                    </button>
                    <v-spacer />
                    <button
                        class="[ text-center ] hoverable left-nav__board-item-btn"
                        :class="expandSideBoards ? 'left-nav__board-item-btn--expanded' : ''"
                        @click="expandSideBoards = !expandSideBoards"
                        @click.prevent=""
                    >
                        <v-icon icon="mdi-chevron-up" />
                    </button>
                </NuxtLink>
            </div>
            

            <div 
                class="expand-boards-container" :style="{
                    maxHeight: expandSideBoards ? '2000px' : '0px',
                    overflowY: expandSideBoards ? 'auto' : 'hidden',
                    marginBottom: expandSideBoards ? '8px' : '0px'
                }"
            >
                <div
                    v-for="board in boards" :key="board.id"
                    class="hoverable hover-list-item left-nav__list-item left-nav__board-item
                        [ pl-3 text-truncate text-medium-emphasis ]"
                >
                    <NuxtLink :to="`/board/board?id=${board.id}`">
                        <v-icon icon="mdi-subdirectory-arrow-right" />{{ board.name }}
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
</template>

<script>
export default {
    name: 'BoardLeftNav',

    data: () => ({
        boards: [],
        expandSideBoards: true
    }),

    // TODO: use a global store
    created() {
        this.getBoards();
    },
    methods: {
        async getBoards() {
            this.boards = [];
            this.loadingBoards = true;
            try {
                let boards = await this.$fetchApi('/api/board/boards', 'GET', {
                    not_self: this.$route.query.shared_with_me ? true : false
                });
                this.boards = boards.boards;
                console.log(boards.boards)
                this.loadingBoards = false;
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

.left-nav {
    border-right: 1px solid $border-color;
    width: $left-nav-width-pc;
    position: fixed;

    max-height: calc(100% - 80px);
    overflow-y: auto;

    $height: 26px;

    a {
        text-decoration: none;
        color: inherit;
    }

    .expand-boards-container {
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
