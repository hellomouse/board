<script setup>
import { useTheme } from 'vuetify';
import { useOptionStore } from '~/store/optionStore.js';

const optStore = useOptionStore();

// eslint-disable-next-line no-undef
useHead({
    title: 'Hellomouse Site',
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/logos/site.png' }],
});

const DESC = 'Website downloader microservice';

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Site Status',
    ogTitle: 'Hellomouse Site Status',
    description: DESC,
    ogDescription: DESC,
    ogImage: '/logos/meta/site.png',
    twitterCard: 'summary_large_image',
});

const theme = useTheme();
theme.global.name.value = optStore.dark_theme ? 'dark' : 'light';
</script>

<template>
    <v-app id="main" ref="app" dark>
        <AppNavbar>
            <template #logo>
                <UiAppLogo 
                    href="/"
                    src="/logos/site.png"
                    title="Site"
                    class="mr-10"
                />
            </template>
        </AppNavbar>

        <v-main class="mt-2">
            <v-container>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import AppNavbar from '../components/ui/AppNavbar.vue';

export default {
    name: 'DefaultLayout',
    components: { AppNavbar }
}
</script>