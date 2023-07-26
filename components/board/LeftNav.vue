<template>
    <v-sheet
        elevation="0"
        class="mr-3 mb-3 left-nav"
        color="transparent"
    >
        <v-btn
            color="red"
        >
            <v-icon icon="mdi-plus" /> {{ buttonLabel }}
        </v-btn>

        <div class="mt-3 mr-2">
            <button class="px-4 hoverable hover-list-item list-item">
                <v-icon icon="mdi-view-dashboard" /> My Boards
            </button>
            <button class="px-4 hoverable hover-list-item list-item">
                <v-icon icon="mdi-folder-account" /> Shared With Me
            </button>
            <button class="mb-4 px-4 hoverable hover-list-item list-item">
                <v-icon icon="mdi-star" /> Favorites
            </button>
            <button class="px-4 hoverable hover-list-item list-item">
                <v-icon icon="mdi-trash-can" /> Trash
            </button>
            <button class="px-4 hoverable hover-list-item list-item">
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
    width: $left-nav-width-pc;

    .list-item {
        height: 2.4rem;
    }
}
</style>
