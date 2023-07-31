<template>
    <v-sheet
        elevation="0"
        width="250"
        class="board-tile hoverable [ mr-3 mb-3 ]"
        :style="{ borderColor: color }"
    >
        <div class="px-4 pt-4">
            <div class="text-truncate text-h6">{{ title }}</div>
        </div>
        
        <div class="px-4 pb-3">
            <div class="board-tile__desc text-truncate">{{ desc }}</div>
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
                        <button class="px-4 hoverable hover-list-item edit-list-item">
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
                                    name: title,
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
                                title: title
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
        title: {
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

    &__menu {
        margin-left: auto;
        margin-bottom: -12px;
        margin-right: -14px;
    }

    &__owner-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 1px solid $border-color;
    }

    &__desc {
        opacity: $secondary-text-opacity;
    }
}
</style>
