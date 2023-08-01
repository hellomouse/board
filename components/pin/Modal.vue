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

                <!-- TODO: type, content box, attachments
                or insert files by url?? -->

                <client-only>
                    <QuillEditor
                        theme="snow" contentType="html" v-model:content="content"
                        :toolbar="[['bold', 'italic', 'underline', 'strike'], ['image', 'link'], [{ 'align': [] }], ['clean']]"
                    />
                    <br><br>
                </client-only>

                <!-- <v-textarea
                    v-model="description" density="compact" class="mb-4" label="Description"
                    oninput="this.value = this.value.substring(0, 300)"
                    rounded="0" variant="solo-filled"></v-textarea> -->

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

// TODO: move to shared js file
const swatches =
    '#F44336,#E91E63,#9C27B0,#673AB7,#3F51B5,#2196F3,#03A9F4,#009688,#4CAF50,#8BC34A,#CDDC39,#FFC107,#FF9800,#FF5722,#607D8B'.split(',');


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
        }
    },
    data() {
        return {
            content: this.pin?.content,
            color: this.pin?.metadata?.color,
            loading: false,

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
        show() {
            this.content = this.pin?.content || '';
            this.color = this.pin?.metadata?.color || swatches[0];
            this.selectedSwatchIndex = Math.max(0, swatches.indexOf(this.color.toUpperCase()));
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
                name: this.name,
                desc: this.description,
                color: this.color,
            };

            // Editing requires id
            if (!this.editMode)
                params.id = this.pin.id;

            this.loading = true;
            try {
                await this.$fetchApi('/api/board/pins', this.editMode ? 'PUT' : 'POST', params);
            } catch (e) {
                let errorMsg = `Failed to modify pin: ${this.$apiErrorToString(e)}`;
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
