<template>
    <v-dialog
        v-model="showModal"
        width="720"
    >
        <v-card rounded="0" width="720" class="py-2">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">{{ editMode ? 'Edit' : 'Create' }} {{ pinTitle }} Pin</h1>

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
                        ref="fileInput"
                        v-model="selected_files"
                        label="Attachments" variant="solo-filled"
                        multiple show-size rounded=0 chips
                        density="compact" style="min-height: 47px"
                        clearable counter class="mt-2 mb-4"
                    />
                </div>

                <!-- BEGIN specialization -->
                <!-- Image gallery -->
                <div v-if="pin?.type === 1 || pin?.type === 'ImageGallery'">
                    <pin-gallery-pin v-model:originalContent="content" @update="updateGalleryImages" />
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
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import '~/assets/css/quill-theme.css';

// Start hack for math
// -------------------------
import katex from 'katex';
import 'katex/dist/katex.min.css';
import jquery from 'jquery';

if (process.client) {
    window.katex = katex;
    window.$ = jquery;
}

// eslint-disable-next-line no-undef
defineAsyncComponent(async () =>
    process.client ? (await import('@edtr-io/mathquill/build/mathquill.js')) : null);
import '@edtr-io/mathquill/build/mathquill.css';

// eslint-disable-next-line no-undef
defineAsyncComponent(async () => {
    let tmp = process.client ? (await import('mathquill4quill'))({ QuillEditor, katex }): null;
    return tmp(QuillEditor.value);
});
import 'mathquill4quill/mathquill4quill.css';
// ------------------------- (End hack)

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
    data() {
        return {
            content: this.pin?.content,
            color: this.pin?.metadata?.color,
            loading: false,
            toolbars: [[{ 'header': [1, 2, 3, 4, false] }], ['bold', 'italic', 'underline', 'strike'], ['code-block', 'image', 'link'], [{ 'align': [] }], ['formula'], ['clean']],
            selectedSwatchIndex: 0,
            downloadOptions: {},
            selected_files: [],
            modules: []
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
    async created() {
        let modules = [];
        if (process.client) {
            const MarkdownShortcuts = await import('quill-markdown-shortcuts');
            const MagicUrl = await import('quill-magic-url');
            const BlotFormatter = await import('quill-blot-formatter/dist/BlotFormatter');
            const ImageUploader = await import('quill-image-uploader');

            // Patch the logic for image uploading >_> because it's broken
            // (note: removes the base64 preview)
            // Note: must be function() not an arrow function
            Reflect.defineProperty(ImageUploader.default.prototype, 'calculatePlaceholderInsertLength', { value: function () {
                return 0;
            }});
            Reflect.defineProperty(ImageUploader.default.prototype, 'insertBase64Image', { value: async function(url) {}});
            Reflect.defineProperty(ImageUploader.default.prototype, ' removeBase64Image', { value: function () {}});

            modules = [
                {
                    name: 'markdownShortcuts',
                    module: MarkdownShortcuts.default,
                    options: {}
                },
                {
                    name: 'magicUrl',
                    module: MagicUrl.default,
                    options: {}
                },
                {
                    name: 'blotFormatter',
                    module: BlotFormatter.default,
                    options: {}
                },
                {
                    name: 'ImageUploader',
                    module: ImageUploader.default,
                    options: {
                        upload: file => {
                            this.$emit('success', `Uploading image... please wait...`);
                            return new Promise((resolve, reject) => {
                                let formData = new FormData();
                                formData.append('files', file, file.name);
                                let requestOptions = {
                                    method: 'POST',
                                    mode: 'cors',
                                    headers: { 'enctype': 'multipart/form-data' },
                                    body: formData,
                                    connection: 'close',
                                    credentials: 'include',
                                    signal: AbortSignal.timeout(10000)
                                };

                                (async () => {
                                    // eslint-disable-next-line no-undef
                                    let result = await $fetch('/api/files', requestOptions);
                                    resolve(`/api/files/single?id=${result.succeeded[0]}`);
                                })();
                            });
                        }
                    }
                }
            ];
        }
        this.modules = modules;
    },
    methods: {
        updateGalleryImages(v) {
            this.selected_files = v.files;
            this.content = v.content.trim() || 'x'; // Placeholder
        },
        async createPin() {
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
                type = pinTypeNameToNumber(type);

            let attachmentPaths = this.pin.attachment_paths || [];
            if ([0, 1].includes(type) && this.selected_files?.length) { // Markdown pin & gallery pin
                if (this.selected_files.length > 50) {
                    this.$emit('error', 'Too many files, at most 50 files at a time!');
                    return;
                }

                let formData = new FormData();
                for (let file of this.selected_files)
                    formData.append('files', file, file.name);

                let requestOptions = {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'enctype': 'multipart/form-data' },
                    body: formData,
                    connection: 'close',
                    credentials: 'include',
                    signal: AbortSignal.timeout(10000)
                };
                this.$emit('success', `Uploading files... please wait...`);

                // eslint-disable-next-line no-undef
                let results = await $fetch('/api/files', requestOptions);
                if (results.failed.length)
                    this.$emit('error', `Failed to upload ${results.failed.length} / ${(this.selected_files?.length || 0)} files`);
                else
                    this.$emit('success', `Uploaded ${results.succeeded.length} / ${(this.selected_files?.length || 0)} files`);
                
                // Combine filename in ID to store
                let uploadedFiles = [];
                for (let i = 0; i < this.selected_files.length; i++) {
                    if (!results.failed.includes(i))
                        uploadedFiles.push(this.selected_files[i]);
                }
                results.succeeded = results.succeeded.map((val, i) =>
                    `${val},${uploadedFiles[i].name}`);
                attachmentPaths = [...new Set(results.succeeded.concat(attachmentPaths))];
                this.selected_files = [];

                if (!this.content.trim())
                    this.content = 'x'; // Placeholder since we can't have empty content
            }

            let params = {
                pin_type: type,
                board_id: this.boardId,
                flags: this.pin.flags || '',
                content: this.content,
                attachment_paths: attachmentPaths,
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
                    this.downloadOptions = {};
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
            let schedulePinPreview = false;
            if (type === 2 && url1 !== url2) {
                try {
                    await this.$fetchApi('/api/board/pins/preview', 'POST', {
                        url: url2,
                        pin_id: pinId
                    });
                    schedulePinPreview = true;
                } catch (e) {
                    let errorMsg = `Failed to schedule pin preview: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }
            }

            this.loading = false;
            this.$emit('update', { id: pinId, schedulePinPreview });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.last-edited {
    opacity: var(--secondary-text-opacity);
}
</style>