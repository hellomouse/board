<template>
    <div class="navbar" fixed>
        <slot name="logo"></slot>

        <slot></slot>

        <div class="navbar__links" style="margin-left: auto">
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        class="navbar-btn mx-2" icon="mdi-apps" color="rgba(0, 0, 0, 0)" flat
                        v-bind="props"></v-btn>
                </template>
                <div>
                    <v-sheet
                        elevation="6"
                        width="210"
                        class="popout-sheet pa-2"
                    >
                        <ui-app-button
                            href="/board"
                            src="/logos/board.svg"
                            title="Board"
                        />
                    </v-sheet>
                </div>
            </v-menu>

            <NuxtLink v-if="!isLoggedIn" class="login-link" :to="'/login?r=' + $route.path">
                Sign In
            </NuxtLink>

            <v-menu v-if="isLoggedIn">
                <template #activator="{ props }">
                    <button class="image-button navbar-btn mx-2" icon="mdi-cog" v-bind="props">
                        <profile-picture :src="user.pfp_url" />
                    </button>
                </template>
                <div>
                    <v-sheet
                        elevation="6"
                        width="200"
                        class="popout-sheet"
                    >
                        <div class="py-3 px-4">
                            <p class="text-truncate popout-sheet__user-name">{{ user.name }}</p>
                            <p class="text-truncate popout-sheet__user-id">@{{ user.id }}</p>
                        </div>

                        <button class="py-3 px-4 hoverable hover-list-item">
                            <v-icon icon="mdi-cog" /> Settings
                        </button>
                        <button class="py-3 px-4 hoverable hover-list-item" @click="logout">
                            <v-icon icon="mdi-logout" /> Sign Out
                        </button>
                        <div class="py-2 px-4">
                            <small>FAQ / Info</small>
                        </div>
                    </v-sheet>
                </div>
            </v-menu>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';

export default {
    computed: {
        user() { return useAuthStore(this.$pinia).user; },
        isLoggedIn() { return useAuthStore(this.$pinia).isLoggedIn; }
    },
    methods: {
        async logout() {
            let authStore = useAuthStore(this.$pinia);
            let requestOptions = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include'
            };

            try {
                // eslint-disable-next-line no-undef
                await $fetch('/api/logout', requestOptions);
            } catch (e) {
                // Ignore error on logout: cookie may be invalid
                // if server restarted, invalidate session on client side
                // if server errors anyways
                console.error(e);
            }
            authStore.logout();
            this.$router.push('/login');
        }
    }
};
</script>

<style lang="scss">
@import "~/assets/variables.scss";

$height: 64px;

.login-link {
    color: white;
    text-decoration: none;
}

.navbar-btn {
    height: 60% !important;
    aspect-ratio: 1 / 1;
    font-size: 1.3rem;
}

$popout-gap: 5px;

.popout-sheet {
    border-radius: 0 !important;
    margin-top: $popout-gap;
    background-color: rgb(var(--v-theme-background-light));

    &__user-name {
        font-size: 1.2rem;
    }
    &__user-id {
        opacity: $secondary-text-opacity;
        margin-top: -2px;
    }

    & > button:first-of-type {
        border-top: 1px solid $border-color;
    }

    & > button {
        width: 100%;
        border-radius: 0;
        border: none;
        outline: none;

        text-align: left;
        border-bottom: 1px solid $border-color;
    }
}

.navbar {
    height: $height;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: start;
    padding: 0 20px;
    background-color: rgb(var(--v-theme-background));

    // Stick to top
    position: sticky;
    top: 0;
    z-index: 999;


    &__links {
        background-color: transparent;
        display: flex;
        flex-direction: row;
        min-width: 200px;
        justify-content: right;
        align-items: center;

        line-height: 100%;
        height: 100%;
    }
}
</style>