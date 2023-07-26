<template>
    <v-app id="main" dark>
        <UiAppNavbar />

        <v-main class="mx-8 mt-4">
            <div class="d-flex flex-row">
                <BoardLeftNav />

                <v-container>
                    <slot />
                </v-container>
            </div>
        </v-main>

        <UiAppFooter />
    </v-app>
</template>
