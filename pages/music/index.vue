<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false
});

// Default board page desc - will be overwritten later
const MUSIC_DESC = 'Unified music playlist';

// eslint-disable-next-line no-undef
useSeoMeta({
    title: 'Hellomouse Music',
    ogTitle: 'Hellomouse Music',
    description: MUSIC_DESC,
    ogDescription: MUSIC_DESC,
    ogImage: '/logos/meta/music.png',
    twitterCard: 'summary_large_image',
});
</script>

<template>
    <NuxtLayout name="music">

    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';

export default {
    data() {
        return {

        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
    },
    watch: {
        '$route.query'() {
            if (this.$route.path === '/music') {

            }
        },
    },
    mounted() {

    },
    destroyed() {

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
@import "~/assets/css/sort.scss";
@import "~/assets/css/state.scss";

</style>