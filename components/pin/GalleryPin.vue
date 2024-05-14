<!--
Example usage:

<pin-gallery-pin @update="func to set selected files" />
-->

<template>
    <div>
        <div class="scroll">
            <img
                v-for="f in selected_files"
                :key="f.name"
                :src="getFileImage(f)"
                class="preview-image"
            />
        </div>
        <br>
        <v-file-input 
            ref="fileInput"
            v-model="selected_files"
            accept="image/*"
            label="Attachments" variant="solo-filled"
            multiple show-size rounded=0 chips
            density="compact" style="min-height: 47px"
            clearable counter class="mt-2 mb-4"
        />

        <v-textarea
            v-model="content"
            label="Note" variant="solo-filled" rounded="0" auto-grow
            :counter="200" :rows="1"
            :rules="rules"
            @input="content = content.replaceAll('\n', '').slice(0, 200)"
        />
        <br>
    </div>
</template>

<script>
export default {
    props: {
        originalContent: {
            required: true,
            type: String
        },
    },
    data() {
        return {
            selected_files: [],
            content: (this.originalContent && this.originalContent.length > 1) ? this.originalContent : '',
            rules: [
                v => v && (v.length <= 200 || 'Max 200 characters'),
                v => v && (v.length > 1 || 'Min 2 characters')
            ],
        };
    },
    watch: {
        selected_files(_newVal, _oldVal) { this.emitEditUpdate(); },
        content(_newVal, _oldVal) { this.emitEditUpdate(); }
    },
    methods: {
        emitEditUpdate() {
            this.$emit('update', {
                files: this.selected_files,
                content: this.content || ''
            });
        },
        getFileImage(file) {
            if (!process.client) return '';
            return URL.createObjectURL(file);
        }
    },

}
</script>

<style lang="scss" scoped>
.scroll {
    max-height: 320px;
    overflow-y: auto;

    .preview-image {
        max-width: 49%;
        max-height: 160px;
        margin: 2px;
    }
}
</style>