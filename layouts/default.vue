<template>
    <v-app id="main" ref="app" dark>
        <AppNavbar />

        <v-main class="mx-16 mt-2">
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