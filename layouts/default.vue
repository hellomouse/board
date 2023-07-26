<template>
    <v-app id="main" dark>
        <AppNavbar />

        <v-main class="mx-16 mt-2">
            <v-container>
                <slot />
            </v-container>
        </v-main>

        <div>{{ $route.name }} {{ useCookie('login') }}</div>

        <AppFooter />
    </v-app>
</template>

<script>
import AppFooter from '../components/ui/AppFooter.vue';
import AppNavbar from '../components/ui/AppNavbar.vue';

export default {
    name: 'DefaultLayout',
    components: { AppFooter, AppNavbar }
}
</script>