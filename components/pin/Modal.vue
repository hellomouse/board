<!--
TODO
-->

<template>
    <v-dialog
        v-model="showModal"
        width="720"
    >
        <v-card rounded="0" width="720" class="py-2">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">{{ editMode ? 'Edit' : 'Create' }} Pin</h1>

                <!-- TODO: content box, attachments
                or insert files by url?? -->

                <client-only>
                    <QuillEditor
                        :style="{ backgroundColor: color }"
                        theme="snow" contentType="html" v-model:content="content"
                        :toolbar="toolbars"
                    />
                    <br>
                </client-only>

                <v-btn
                    v-for="(col, index) in swatches" :key="col"
                    density="compact" width="40" style="min-width: 40px;"
                    :color="col" class="mr-1 mb-1"
                    @click="[color, selectedSwatchIndex] = [col, index]"
                >
                    <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                </v-btn>

                <v-file-input 
                    label="Attachments" variant="solo-filled"
                    multiple show-size rounded=0 chips
                    density="compact" style="min-height: 47px"
                    clearable counter class="mt-2 mb-4"
                />
            </v-card-text>
            <v-card-actions class="mr-3">
                <p class="ml-4 d-block last-edited" v-if="pin.edited">Edited {{ pin.edited }}</p>
                <v-spacer />
                <v-btn color="primary" @click="$emit('update', false)">Cancel</v-btn>
                <v-btn color="primary" variant="elevated" :loading="loading" @click="createPin">{{ editMode ? 'Apply' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
const QuillEditor = process.client ? (await import('@vueup/vue-quill')).QuillEditor : null;
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '~/assets/css/quill-theme.css';

const swatches =
    ',#77172e,#692b17,#7c4a03,#264d3b,#0c625d,#256377,#284255,#472e5b,#6c394f,#4b443a'.split(',');

export default {
    name: 'PinModal',
    components: {
        QuillEditor
    },
    props: {
        editMode: { // Edit existing pin instead of create
            type: Boolean,
            default: false
        },
        pin: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            required: true
        },
        boardId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            content: this.pin?.content,
            color: this.pin?.metadata?.color,
            loading: false,
            toolbars: [['bold', 'italic', 'underline', 'strike'], ['code-block', 'image', 'link'], [{ 'align': [] }], ['clean']],

            swatches,
            selectedSwatchIndex: 0
        };
    },
    computed: {
        showModal: {
            get() { return this.show; },
            set(val) { this.$emit('show', val); }
        }
    },
    watch: {
        pin() {
            this.content = this.pin?.content || '';
            this.color = this.pin?.metadata?.color || swatches[0];
            this.selectedSwatchIndex = Math.max(0, swatches.indexOf(this.color));
        }
    },
    methods: {
        async createPin() {
            // TODO: per type checks
            console.log(this.content)
            if (!this.content) {
                this.$emit('error', 'Content cannot be empty');
                return;
            }

            let params = {
                pin_type: 0, // TODO
                board_id: this.boardId,
                flags: '',
                content: this.content,
                attachment_paths: [],
                metadata: {
                    color: this.color
                }
            };

            // Editing requires id
            if (this.editMode)
                params.id = this.pin.pin_id;

            this.loading = true;
            try {
                await this.$fetchApi('/api/board/pins', this.editMode ? 'PUT' : 'POST', params);
            } catch (e) {
                let errorMsg = `Failed to ${this.editMode ? 'modify' : 'create'} pin: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
                this.loading = false;
                return;
            }
            this.loading = false;
            this.$emit('update', true);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.last-edited {
    opacity: $secondary-text-opacity;
}
</style>