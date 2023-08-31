<template>
    <v-sheet
        elevation="0"
        width="250"
        class="board-tile hoverable [ mr-3 mb-3 ]"
        :style="{ borderColor: color }"
        :class="selected ? 'selected' : ''"
    >
        <div
            class="px-4 pt-4"
            style="cursor: pointer"
            @click="clickHandler"
        >
            <div class="text-truncate text-h6">{{ name }}</div>
        </div>
        
        <div class="px-4 pb-3">
            <div
                class="board-tile__desc text-truncate"
                style="cursor: pointer"
                @click="clickHandler"
            >{{ desc }}</div>
            <div class="board-tile__owner-row pt-1 mt-1">
                <profile-picture class="mr-1" size="12pt" src="" />

                <div class="d-inline-block text-truncate">
                    <small>@{{ creatorId }}</small>
                </div>

                <v-menu>
                    <template #activator="{ props }">
                        <v-btn
                            density="comfortable"
                            icon="mdi-dots-vertical"
                            v-bind="props"
                            class="board-tile__menu"
                            flat color="transparent"
                        ></v-btn>
                    </template>
                
                    <v-sheet elevation="8" rounded="0">
                        <button class="px-4 hoverable hover-list-item edit-list-item" @click="copyShareLink">
                            <v-icon icon="mdi-link" />Permalink
                        </button>
                        <button
                            v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                            class="px-4 hoverable hover-list-item edit-list-item"
                            @click="$emit('update', {
                                type: 'share',
                                id: boardId
                            })"
                        >
                            <v-icon icon="mdi-account-plus" />Share
                        </button>
                        <button
                            v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                            class="px-4 hoverable hover-list-item edit-list-item"
                            @click="$emit('update', {
                                type: 'edit',
                                board: {
                                    id: boardId,
                                    name: name,
                                    desc,
                                    creator: creatorId,
                                    color
                                }
                            })">
                            <v-icon icon="mdi-pencil" />Edit
                        </button>
                        <button
                            v-if="['Owner'].includes(currentUserPerm)"
                            class="px-4 text-red [ hoverable hover-list-item ] [ edit-list-item edit-list-item--line ]"
                            @click="$emit('update', {
                                type: 'open_board_delete',
                                id: boardId,
                                name: name
                            })"
                        >
                            <v-icon icon="mdi-trash-can" color="red" />Delete
                        </button>
                    </v-sheet>
                </v-menu>
            </div>
        </div>
    </v-sheet>
</template>

<script>
export default {
    name: 'BoardBoard',
    props: {
        boardId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: 'No title provided'
        },
        desc: {
            type: String,
            default: 'No desc provided'
        },
        creatorId: {
            type: String,
            default: 'Unknown creator'
        },
        color: {
            type: String,
            default: "#FFFFFF",
            validator(value) { return /^#[0-9a-fA-F]{6}$/i.test(value); }
        },
        currentUserPerm: {
            type: String,
            default: ''
        },
        selectTrigger: {
            type: Boolean,
            default: false
        },
        unselectTrigger: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            numClicks: 0,
            selected: false
        };
    },
    watch: {
        selectTrigger() {
            this.selected = true;
        },
        unselectTrigger() {
            this.selected = false;
        }
    },
    methods: {
        copyShareLink() {
            if (process.client)
                navigator.clipboard.writeText(window.location.origin + '/board/board?id=' + this.boardId);
            this.$emit('success', 'Link copied!');
        },
        clickHandler() {
            this.numClicks++;
            if (this.numClicks === 1) {
                let self = this;
                setTimeout(() => {
                    if (self.numClicks === 1) { // Single click: select
                        self.selected = !self.selected;
                        this.$emit('select', { id: this.boardId, select: self.selected });
                    }
                    else                       // Double click: go to board
                        self.goToBoard();
                    self.numClicks = 0;
                }, 200);
            }
        },
        goToBoard() {
            this.$router.push('/board/board?id=' + this.boardId);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/dropdown-menu.scss";

.board-tile {
    max-width: 100%;
    border-right: 3px solid;
    display: inline-block;
    outline-offset: -1px;
    user-select: none;

    &.selected {
        outline: 1px solid rgb(var(--v-theme-primary)) !important;
    }
    
    &__menu {
        margin-left: auto;
        margin-bottom: -12px;
        margin-right: -14px;
    }

    &__owner-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 1px solid var(--border-color);
    }

    &__desc {
        opacity: $secondary-text-opacity;
    }
}
</style>
