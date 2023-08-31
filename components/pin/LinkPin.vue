<!--
Example usage:

TODO

Content format:
    1st line: url
    2nd line: note with newlines removed
-->

<template>
    <div class="container">
        <v-text-field
            v-model="url"
            label="URL" density="compact" rounded="0" variant="solo-filled"
            class="mb-2"
        />

        <v-textarea
            v-model="desc"
            label="Note" variant="solo-filled" rounded="0" auto-grow
            :counter="200"
            :rules="rules"
            @input="desc = desc.replaceAll('\n', '').slice(0, 200)"
        />

        <v-checkbox
            v-model="downloadWebsite"
            label="Download website (Counts towards storage quota)" color="red"
        />
    </div>
</template>

<script>
export default {
    props: {
        content: {
            required: true,
            type: String
        }
    },
    data() {
        const lines = this.content.split('\n');
        return {
            url: lines[0] || '',
            desc: lines[1] || '',
            downloadWebsite: false,
            rules: [v => v && (v.length <= 200 || 'Max 200 characters')],
        };
    },
    watch: {
        url() { this.emitContentUpdate(); },
        desc() { this.emitContentUpdate(); }
    },
    methods: {
        emitContentUpdate() {
            this.$emit('update:content', `${this.url.replaceAll('\n', '')}\n${this.desc.replaceAll('\n', '')}`);
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 10px;
    background-size: cover !important;
    background-position: center !important;
}
</style>