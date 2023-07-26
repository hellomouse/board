<template>
    <v-sheet
        elevation="0"
        class="mr-3 mb-3"
        width="270"
        color="transparent"
    >
        <v-btn
            color="red"
        >
            + {{ buttonLabel }}
        </v-btn>

        <v-list>
            <v-list-item title="My boards"></v-list-item>
            <v-list-item title="Shared with me"></v-list-item>
            <v-list-item title="Favorites"></v-list-item>
            <v-list-item title="Trash"></v-list-item>
            <v-list-item title="Storage"></v-list-item>
        </v-list>
    </v-sheet>
</template>

<script>
export default {
    name: 'BoardBoard',
    props: {
        buttonLabel: {
            type: String,
            default: 'New Board'
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";


</style>
