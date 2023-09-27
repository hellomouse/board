<script setup>
import { useTheme } from 'vuetify';
import { useOptionStore } from '~/store/optionStore.js';

const optStore = useOptionStore();

// eslint-disable-next-line no-undef
useHead({
    title: 'Hellomouse Music',
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/logos/music.png' }],
});

const theme = useTheme();
theme.global.name.value = optStore.dark_theme ? 'dark' : 'light';
</script>

<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar>
            <template #logo>
                <UiAppLogo 
                    href="/music"
                    src="/logos/music.png"
                    title="Music"
                />
            </template>
            <v-spacer />
        </UiAppNavbar>

        <v-main class="mx-sm-8 mt-4">
            <slot />
        </v-main>
    </v-app>
</template>
