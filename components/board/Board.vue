<template>
    <v-sheet
        elevation="0"
        width="250"
        class="board-tile hoverable mr-3 mb-3"
        :style="{ borderColor: color }"
    >
        <div class="px-4 pt-4">
            <div class="text-truncate text-h6">{{ title }}</div>
        </div>
        
        <div class="px-4 pb-3">
            <div class="board-tile__desc text-truncate">{{ desc }}</div>
            <div class="board-tile__owner-row pt-1 mt-1">
                <div class="board-tile__pfp mr-1"></div>
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
                        <button class="px-4 hoverable hover-list-item edit-list-item">
                            <v-icon icon="mdi-account-plus" />Share
                        </button>
                        <button class="px-4 hoverable hover-list-item edit-list-item line">
                            <v-icon icon="mdi-pencil" />Edit
                        </button>
                        <button class="px-4 text-red [ hoverable hover-list-item ] edit-list-item" @click="deleteModal = true">
                            <v-icon icon="mdi-trash-can" color="red" />Delete
                        </button>
                    </v-sheet>
                </v-menu>
            </div>
        </div>

        <DeleteConfirmation
            v-model="deleteModal"
            title="Delete Board"
            :loading="deleteModalLoading"
            :confirmation-string="title"
            @update="die => deleteBoard(die)"
        >
            <p>
                Are you sure you want to delete this board?
                This will delete the board <b>and all pins</b> associated
                with the board and <b>cannot be undone!</b>
            </p>
        </DeleteConfirmation>
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
        }
    },
    data: () => ({
        deleteModal: false,
        deleteModalLoading: false
    }),
    methods: {
        async deleteBoard(shouldDelete) {
            if (!shouldDelete) {
                this.deleteModal = false;
                return;
            }

            this.deleteModalLoading = true;
            await this.$fetchApi('/api/board/boards', 'DELETE', { id: this.boardId });
            this.deleteModal = false;
            this.deleteModalLoading = false;
            this.$emit('update', 'board_delete');
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

    .board-tile__menu {
        margin-left: auto;
        margin-bottom: -12px;
        margin-right: -14px;
    }

    .board-tile__owner-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 1px solid $border-color;
    }

    .board-tile__desc {
        opacity: $secondary-text-opacity;
    }

    .board-tile__pfp {
        width: 12pt;
        height: 12pt;
        vertical-align: middle;
        border-radius: 50%;
        background: white;
        display: inline-block;
    }
}
</style>
