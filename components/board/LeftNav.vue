<template>
    <v-sheet
        elevation="0"
        class="mr-3 mb-3 left-nav"
        width="240"
        color="transparent"
    >
        <v-btn
            color="red"
        >
            <v-icon icon="mdi-plus" /> {{ buttonLabel }}
        </v-btn>

        <div class="mt-3">
            <button class="py-2 px-4 hoverable hover-list-item">
                <v-icon icon="mdi-view-dashboard" /> My Boards
            </button>
            <button class="py-2 px-4 hoverable hover-list-item">
                <v-icon icon="mdi-folder-account" /> Shared With Me
            </button>
            <button class="py-2 px-4 hoverable hover-list-item">
                <v-icon icon="mdi-star" /> Favorites
            </button>
            <button class="py-2 px-4 hoverable hover-list-item">
                <v-icon icon="mdi-trash-can" /> Trash
            </button>
            <button class="py-2 px-4 hoverable hover-list-item">
                <v-icon icon="mdi-cloud" /> Storage
            </button>
        </div>
    </v-sheet>
</template>

<script>
export default {
    name: 'BoardBoard',
    props: {
        buttonLabel: {
            type: String,
            default: 'New Board'
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.left-nav {
    border-right: 1px solid $border-color;
}
</style>
