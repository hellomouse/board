<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar />

        <v-main class="mx-8 mt-4">
            <div class="d-flex flex-row">
                <BoardLeftNav />

                <v-container class="container pt-0">
                    <slot />
                </v-container>
            </div>
        </v-main>

        <UiAppFooter />
    </v-app>
</template>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
}
</style>