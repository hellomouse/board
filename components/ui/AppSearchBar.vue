<template>
    <v-text-field
        v-model="input"
        label="" rounded="0"
        prepend-inner-icon="mdi-magnify"
        :placeholder="placeholder"
        class="my-2 navbar-search"
        style="width: 570px"
        density="compact"
        clearable
        flat variant="solo-filled"

        @keyup.enter="$emit('search', input)"
    />
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            required: true
        }
    },
    data: () => ({
        input: ''
    }),
}
</script>

<style lang="scss">
.navbar-search .v-field {
    font-size: 1rem;
    vertical-align: middle;

    input { margin: auto 0; }
}
</style>