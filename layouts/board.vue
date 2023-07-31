<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar>
            <template #logo>
                <UiAppLogo 
                    href="/board"
                    src="/logos/board.png"
                    title="Board"
                    class="mr-10"
                />
            </template>

            <v-text-field
                label="" rounded="0"
                placeholder="Search"
                flat variant="solo-filled"
            ></v-text-field>  <!-- TODO prepend icon -->
        </UiAppNavbar>

        <v-main class="mt-4">
            <slot />
        </v-main>
    </v-app>
</template>
