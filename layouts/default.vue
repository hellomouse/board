<script setup>
// eslint-disable-next-line no-undef
useHead({
    title: 'Hellomouse Apps',
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/logos/main.svg' }],
});

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Apps',
    ogTitle: 'Hellomouse Apps',
    description: 'An app suite for Hellomouse',
    ogDescription: 'An app suite for Hellomouse',
    ogImage: '/logos/meta/main.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <v-app id="main" ref="app" dark>
        <AppNavbar>
            <template #logo>
                <UiAppLogo 
                    href="/"
                    src="/logos/main.svg"
                    title="Apps"
                    class="mr-10"
                />
            </template>
        </AppNavbar>

        <v-main class="mt-2">
            <v-container>
                <slot />
            </v-container>
        </v-main>

        <!-- <div>{{ $route.name }}</div> -->

    </v-app>
</template>

<script>
import AppNavbar from '../components/ui/AppNavbar.vue';

export default {
    name: 'DefaultLayout',
    components: { AppNavbar }
}
</script>