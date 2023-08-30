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
                <h1 class="mb-4 text-truncate">{{ editMode ? 'Edit' : 'Create' }} {{ pinTitle }} Pin</h1>

                <!-- TODO: content box, attachments
                or insert files by url?? -->

                <!-- Markdown -->
                <div v-if="pin?.type === 0 || !pin.type">
                    <client-only>
                        <QuillEditor
                            v-model:content="content"
                            :style="{ background: background }" theme="snow"
                            content-type="html"
                            :modules="modules"
                            :toolbar="toolbars"
                        />
                        <br>
                    </client-only>

                    <v-file-input 
                        label="Attachments" variant="solo-filled"
                        multiple show-size rounded=0 chips
                        density="compact" style="min-height: 47px"
                        clearable counter class="mt-2 mb-4"
                    />
                </div>

                <!-- BEGIN specialization -->
                <!-- Image gallery -->
                <div v-if="pin.type === 1">
                    - file attachments
                    - image gallery preview
                </div>

                <!-- Checklist -->
                <div v-if="pin.type === 4">
                    <pin-checklist-pin :style="{ background: background }" />
                </div>
                <!-- END -->


                <!-- Colors -->
                <pin-palette
                    :selected-swatch-index="selectedSwatchIndex"
                    @color="update => { [color, selectedSwatchIndex] = [update.color, update.index]; }"
                />
            </v-card-text>
            <v-card-actions class="mr-3">
                <p v-if="pin.edited" class="ml-4 d-block last-edited">Edited {{ pin.edited }}</p>
                <v-spacer />
                <v-btn color="primary" @click="$emit('update', false)">Cancel</v-btn>
                <v-btn color="primary" variant="elevated" :loading="loading" @click="createPin">{{ editMode ? 'Apply' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
// eslint-disable-next-line no-undef
const QuillEditor = defineAsyncComponent(async () =>
    process.client ? (await import('@vueup/vue-quill')).QuillEditor : null
);
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '~/assets/css/quill-theme.css';

import MarkdownShortcuts from 'quill-markdown-shortcuts';
import MagicUrl from 'quill-magic-url';
import BlotFormatter from 'quill-blot-formatter';

import { getBackground, getColor, SWATCHES } from '~/helpers/board/pin-colors.js';
import { useOptionStore } from '~/store/optionStore.js';

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
        pinTitle: {
            type: String,
            default: ''
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
    setup: () => {
        const modules = [
            {
                name: 'markdownShortcuts',
                module: MarkdownShortcuts,
                options: {}
            },
            {
                name: 'magicUrl',
                module: MagicUrl,
                options: {}
            },
            {
                name: 'blotFormatter',
                module: BlotFormatter,
                options: {}
            },
        ];
        return { modules }
    },
    data() {
        return {
            content: this.pin?.content,
            color: this.pin?.metadata?.color,
            loading: false,
            toolbars: [[{ 'header': [1, 2, 3, 4, false] }], ['bold', 'italic', 'underline', 'strike'], ['code-block', 'image', 'link'], [{ 'align': [] }], ['clean']],
            selectedSwatchIndex: 0
        };
    },
    computed: {
        background() {
            let color = getColor(this.color, !useOptionStore(this.$pinia).dark_theme);
            return getBackground(color);
        },
        showModal: {
            get() { return this.show; },
            set(val) { this.$emit('show', val); }
        }
    },
    watch: {
        pin() {
            this.content = this.pin?.content || '';
            this.color = this.pin?.metadata?.color || SWATCHES[0];
            this.selectedSwatchIndex = Math.max(0, SWATCHES.indexOf(this.color));
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
                pin_type: this.pin.type,
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