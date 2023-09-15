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
        <v-container class="text-center">
            <h1>[Username]'s Links</h1>

            <p>
                [description] {{ $route.params.slug }} {{ $route.path }}
            </p>

            <div style="max-width: 300px; margin: 0 auto">
                <v-text-field
                    v-model="urlInput" label="Add URL" class="mb-4"
                    variant="solo-filled" rounded="0" density="compact"
                    maxlength="4096" @keydown.enter="addUrl"
                />

                <link-link
                    v-for="link in links"
                    :key="link.id"

                    class="mb-2"

                    :link-id="link.id"
                    :url="link.url"
                    :show-delete="false"
                />
            </div>

            <v-snackbar
                v-model="showErrorToast" color="error" rounded="0" theme="dark"
                transition="scroll-y-reverse-transition"
            >
                {{ toastErrorMsg }}
            </v-snackbar>
        </v-container>
    </NuxtLayout>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import LinkLink from '~/components/link/Link.vue';

export default {
    components: { LinkLink },
    data() {
        return {
            urlInput: '',
            links: [],

            showErrorToast: false,
            toastErrorMsg: ''
        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; }
    },
    watch: {
        async '$route.params.slug'() {
            await this.onLoad();
        }
    },
    // Get boards on page first load
    async created() {
        await this.onLoad();
    },
    methods: {
        async onLoad() {
            if (this.$route.path === '/link' || this.$route.path.startsWith('/link/')) {
                // If home page redirect to self or 404 if not logged in
                if (!this.$route.params.slug)
                    // eslint-disable-next-line no-undef
                    return await navigateTo(this.user ? ('/link/' + this.user.id) : '/404');

                // Check if user exists, if not redirect to 404
                // TODO

                // Get links
                await this.fetchLinks();
            }
        },
        // Update links in list
        async fetchLinks() {
            try {
                let links = await this.$fetchApi('/api/link', 'GET', {
                    user_id: this.$route.params.slug.at(-1)
                });
                links.links.sort((a, b) => a.url.localeCompare(b.url));
                this.links = links.links;
            } catch (e) {
                console.error(e);
                [this.showErrorToast, this.toastErrorMsg] = [true, 'Failed to get links: ' + this.$apiErrorToString(e)];
            }
        },
        // Add new link
        async addUrl() {
            let url = this.urlInput;
            if (!url) return;
            
            try {
                let id = (await this.$fetchApi('/api/link', 'POST', { url })).id;
                if (id >= 0) {
                    this.links.push({ id, url });
                    this.links.sort((a, b) => a.url.localeCompare(b.url));
                }
                this.urlInput = '';
            } catch (e) {
                console.error(e);
                [this.showErrorToast, this.toastErrorMsg] = [true, 'Failed to add link: ' + this.$apiErrorToString(e)];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

</style>