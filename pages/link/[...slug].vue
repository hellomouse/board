<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false
});

// Default link page desc - will be overwritten later
const BOARD_DESC = 'Hellomouse Linktree clone';

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Link',
    ogTitle: 'Hellomouse Link',
    description: BOARD_DESC,
    ogDescription: BOARD_DESC,
    ogImage: '/logos/meta/link.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <NuxtLayout name="link">
        <v-container>
            <p>
                lol cool {{ $route.params.slug }}
            </p>
        </v-container>
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { useOptionStore } from '~/store/optionStore.js';

export default {
    data() {
        return {

        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; }
    },
    watch: {
        '$route.query'() {
            if (this.$route.path === '/link') {
                
            }
        }
    },
    // Get boards on page first load
    created() {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

</style>