<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar />

        <v-main class="mx-8 mt-4">
            <BoardLeftNav />

            <v-container class="container pt-0">
                <slot />
            </v-container>
        </v-main>

        <UiAppFooter />
    </v-app>
</template>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
    margin-left: $left-nav-width-pc;
}
</style>