<template>
    <v-app id="main" ref="app" dark>
        <UiAppNavbar>
            <template #logo>
                <UiAppLogo 
                    href="/board"
                    src="/logos/board.png"
                    title="Board"
                />
            </template>

            <ui-app-search-bar :placeholder="placeholder" @search="search" />
            <v-spacer />
        </UiAppNavbar>

        <v-main class="mx-8 mt-4">
            <slot />
        </v-main>
    </v-app>
</template>

<script>
export default {
    computed: {
        placeholder() {
            return this.isPinSearch() ?
                'Search pins in board' :
                'Search boards';
        }
    },
    methods: {
        isPinSearch() {
            return this.$route.path.includes('/board/board');
        },
        search(v) {
            const isPinSearch = this.isPinSearch();
            if (isPinSearch) { /* TODO */ }
            else
                this.$router.push('/board?search=' + v);
        }
    }
}
</script>
