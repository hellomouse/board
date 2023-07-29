<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar>
            <v-text-field
                label="" rounded="0"
                placeholder="Search"
                flat variant="solo-filled"
            ></v-text-field>  <!-- TODO prepend icon -->
        </UiAppNavbar>

        <v-main class="mx-8 mt-4">
            <slot />
        </v-main>
    </v-app>
</template>
