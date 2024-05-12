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
            <h1>{{ displayName }} Links</h1>

            <p>
                Hellomouse @{{ ($route.params && $route.params.slug) ? $route.params.slug.at(-1) : '' }}
            </p>

            <div v-if="loading" class="link-container">
                <v-progress-circular
                    style="margin-top: 180px"
                    :width="4" :size="50" color="primary" indeterminate
                />
            </div>

            <div v-if="!loading" class="link-container mt-6">
                <div v-if="isSelf" class="d-flex">
                    <v-text-field
                        v-model="urlInput" label="Add URL" class="mb-4"
                        variant="solo-filled" rounded="0" density="compact"
                        maxlength="4096" @keydown.enter="addUrl"
                    />
                    <v-checkbox-btn
                        v-model="deleteMode" color="red"
                        style="max-width: 150px; margin-top: -13px"
                        label="Delete mode" />
                </div>

                <div v-if="loading">lol loading</div>

                <h2
                    v-if="links.length === 0" class="text-disabled"
                    style="padding-top: 150px;"
                >This user has no links yet</h2>

                <link-link
                    v-for="link in links"
                    :key="link.id"

                    class="mb-2 mx-sm-1"

                    :link-id="link.id"
                    :url="link.url"
                    :show-delete="isSelf && deleteMode"

                    @delete="deleteLink"
                />

                <!-- Dummy for spacing -->
                <div v-if="links.length % 2 === 1" class="d-inline-block mx-sm-1 mb-2" style="width: 300px"></div>
            </div>

            <small class="mt-8 d-block">
                <span
                    class="text-teal-lighten-3"
                    style="cursor: pointer"
                    @click="copyModal = true"
                >Click here to get a plaintext copyable version</span> /
                Credit for the majority of the button icons and styles goes to <a href="https://github.com/sethcottle/littlelink/tree/main">LittleLink</a> (MIT License)
            </small>

            <v-snackbar
                v-model="showErrorToast" color="error" rounded="0" theme="dark"
                transition="scroll-y-reverse-transition"
            >
                {{ toastErrorMsg }}
            </v-snackbar>
            <v-snackbar
                v-model="showSuccessToast" color="success"
                rounded="0" theme="dark" timeout="2000"
                transition="scroll-y-reverse-transition"
            >
                {{ toastSuccessMsg }}
            </v-snackbar>
        </v-container>

        <v-dialog
            v-model="copyModal"
            width="400"
        >
            <v-card>
                <v-card-text>
                    <code><pre class="copy-text-area">{{ copyText }}</pre></code>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="copyModal = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
            displayName: '...',
            copyModal: false,
            loading: false,

            deleteMode: false,
            lastDelete: 0,

            showErrorToast: false,
            toastErrorMsg: '',
            showSuccessToast: false,
            toastSuccessMsg: ''
        };
    },
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
        copyText() {
            return this.links.map((link, i) => `${i + 1}: ${link.url}`).join('\n');
        },
        isSelf() {
            return this.$route.params.slug && (this.$route.params.slug.at(-1) || '') === (this.user ? this.user.id : 'not_slug');
        }
    },
    watch: {
        async '$route.params.slug'() {
            await this.onLoad();
        }
    },
    // Get boards on page first load
    created() {
        this.onLoad();
    },
    methods: {
        async onLoad() {
            if (this.$route.path === '/link' || this.$route.path.startsWith('/link/')) {
                // If home page redirect to self or 404 if not logged in
                if (!this.$route?.params?.slug)
                    return this.$router.replace({ path: ((this.user && this.user.id) ? ('/link/' + this.user.id) : '/404') });
                await this.fetchLinks();
            }
        },
        // Update links in list
        async fetchLinks() {
            this.loading = true;
            try {
                let links = await this.$fetchApi('/api/link', 'GET', {
                    user_id: (this.$route.params && this.$route.params.slug) ? this.$route.params.slug.at(-1) : ''
                });

                // No user, redirect
                if (!links.creator_name) {
                    this.$router.replace({ path: '/404' });
                    return;
                }

                this.displayName = links.creator_name + (links.creator_name.toLowerCase().endsWith('s') ? '\'' : '\'s');
                links.links.sort((a, b) => a.url.localeCompare(b.url));
                this.links = links.links;
            } catch (e) {
                [this.showErrorToast, this.toastErrorMsg] = [true, 'Failed to get links: ' + this.$apiErrorToString(e)];
            }
            this.loading = false;
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
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Link Added!'];
            } catch (e) {
                [this.showErrorToast, this.toastErrorMsg] = [true, 'Failed to add link: ' + this.$apiErrorToString(e)];
            }
        },
        async deleteLink(id, url) {
            if (Date.now() - this.lastDelete < 500)
                return; // Don't allow spamming delete
            this.lastDelete = Date.now();

            try {
                await this.$fetchApi('/api/link', 'DELETE', { id });
                this.links = this.links.filter(l => l.id !== id);
                [this.showSuccessToast, this.toastSuccessMsg] = [true, 'Deleted ' + url + '!'];
            } catch (e) {
                [this.showErrorToast, this.toastErrorMsg] = [true, 'Failed to delete link: ' + this.$apiErrorToString(e)];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.link-container {
    width: 700px;
    max-width: 100%;
    min-height: 400px;
    margin: 0 auto;
}

.copy-text-area {
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;

    user-select: all;
    font-size: 12px;
    padding: 8px;
    background: rgba(var(--v-theme-on-surface), var(--v-selected-opacity));
}
</style>