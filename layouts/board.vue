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
                prepend-inner-icon="mdi-magnify"
                placeholder="Search"
                clearable
                flat variant="solo-filled"
            ></v-text-field>
        </UiAppNavbar>

        <v-main class="mx-8 mt-4">
            <slot />
        </v-main>
    </v-app>
</template>
