<template>
    <v-sheet
        elevation="0"
        class="pr-3 mb-3 left-nav"
        color="transparent"
    >
        <slot></slot>

        <div class="mt-3">
            <NuxtLink to="/board">
                <button class="px-4 hoverable hover-list-item left-nav__list-item">
                    <v-icon icon="mdi-view-dashboard" /> My Boards
                </button>
            </NuxtLink>
            <NuxtLink to="/board?shared_with_me=true">
                <button class="px-4 hoverable hover-list-item left-nav__list-item">
                    <v-icon icon="mdi-folder-account" /> Shared With Me
                </button>
            </NuxtLink>
            <button class="mb-4 px-4 hoverable hover-list-item left-nav__list-item">
                <v-icon icon="mdi-star" /> Favorites
            </button>
            <button class="px-4 hoverable hover-list-item left-nav__list-item">
                <v-icon icon="mdi-cloud" /> Storage
            </button>
        </div>
    </v-sheet>
</template>

<script>
export default {
    name: 'BoardLeftNav'
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.left-nav {
    border-right: 1px solid $border-color;
    width: $left-nav-width-pc;
    position: fixed;

    a {
        text-decoration: none;
        color: inherit;
    }

    &__list-item {
        height: $menu-item-height;
        user-select: none;
    }
}
</style>
