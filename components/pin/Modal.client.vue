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
                <div v-if="pin?.type === 0 || !pin.type || pin?.type === 'Markdown'">
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
                <div v-if="pin?.type === 1 || pin?.type === 'ImageGallery'">
                    - file attachments
                    - image gallery preview
                </div>

                <!-- Checklist -->
                <div v-if="pin?.type === 3 || pin?.type === 'Checklist'">
                    <pin-checklist-pin
                        v-model:content="content"
                        :style="{ background: background }"
                    />
                </div>

                <!-- Url -->
                <div v-if="pin?.type === 2 || pin?.type === 'Link'">
                    <pin-link-pin
                        v-model:content="content"
                        v-model:downloadOptions="downloadOptions"
                        :style="{ background: background }"
                    />
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

import { pinTypeNameToNumber } from '~/helpers/board/pin.js';
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
            selectedSwatchIndex: 0,
            downloadOptions: {}
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
            if (!this.content) {
                this.$emit('error', 'Content cannot be empty');
                return;
            }

            // Ensure this matches database config
            if (this.content.length > 20000) {
                this.$emit('error', 'Exceeded maximum pin size of 20,000 characters (including HTML formatting)');
                return;
            }

            let type = this.pin.type;
            if (typeof type === 'string') // Convert type to numeric
                type = pinTypeNameToNumber(type)

            let params = {
                pin_type: type,
                board_id: this.boardId,
                flags: this.pin.flags || '',
                content: this.content,
                attachment_paths: [],
                metadata: {
                    color: this.color
                }
            };

            // Editing requires id
            let pinId = this.editMode ? this.pin.pin_id : null;
            if (this.editMode)
                params.id = this.pin.pin_id;

            // For comparing if url changed
            let [url1, url2] = ['', ''];
            if (type === 2) {
                url1 = (this.pin && this.pin.content) ? this.pin.content.split('\n')[0] : '';
                url2 = this.content.split('\n')[0];

                // Inject URL metadata from original to new if url is the same
                let content = params.content.split('\n');
                while (content.length < 6)
                    content.push('');
                for (let i = 2; i < 6; i++) {
                    let newLine = url1 === url2 ?
                        (content[i] || (this.pin && this.pin.content ? this.pin.content.split('\n')[i] : '')) : '';
                    content[i] = newLine;
                }
                params.content = content.join('\n');
            }

            // Download website request for link pins
            if (type === 2 && this.downloadOptions.url) {
                try {
                    let id = await this.$fetchApi('/api/site/download', 'POST', this.downloadOptions);
                    id = id.uuid;

                    const extMap = {
                        pdf: 'pdf',
                        screenshot: 'webp',
                        html: 'html',
                        media: 'html'
                    };

                    // Format: strategy,url|strategy,url|...
                    let content = params.content.split('\n');
                    if (url1 !== url2) content[5] = '';
                    content[5] = content[5].split('|').filter(x => !x.startsWith(this.downloadOptions.strategy)).filter(x => x);
                    content[5].push(this.downloadOptions.strategy + ',' + id + '.' + (extMap[this.downloadOptions.strategy] || 'html'));
                    content[5] = content[5].join('|');
                    params.content = content.join('\n');
                } catch (e) {
                    let errorMsg = `Failed to download site: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }
            }

            // Edit pin content
            this.loading = true;
            try {
                let result = await this.$fetchApi('/api/board/pins', this.editMode ? 'PUT' : 'POST', params);
                if (!pinId) pinId = result.id;
            } catch (e) {
                let errorMsg = `Failed to ${this.editMode ? 'modify' : 'create'} pin: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
                this.loading = false;
                return;
            }

            // Link pin: generate preview
            if (type === 2 && url1 !== url2) {
                try {
                    await this.$fetchApi('/api/board/pins/preview', 'POST', {
                        url: url2,
                        pin_id: pinId
                    });
                } catch (e) {
                    let errorMsg = `Failed to schedule pin preview: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }
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