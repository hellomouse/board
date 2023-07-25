<template>
    <v-app id="main" dark>
        <v-main class="mx-16 mt-2">
            <v-container>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'DefaultLayout'
}
</script>