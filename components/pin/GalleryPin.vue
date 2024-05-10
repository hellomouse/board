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
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected_files: []
        };
    },
    watch: {
        selected_files(_newVal, _oldVal) {
            this.$emit('update', this.selected_files);
        }
    },
    methods: {
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