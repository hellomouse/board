<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-2">
                <h1 class="mb-2">{{ verb }} Tag</h1>
                <v-text-field
                    v-model="name" density="compact" class="mb-4" label="Name"
                    oninput="this.value = this.value.substring(0, 60)"
                    rounded="0" variant="solo-filled"></v-text-field>

                <div class="mb-3">
                    <v-btn
                        v-for="(col, index) in swatches" :key="col"
                        density="compact" width="40" style="min-width: 40px;"
                        :color="col" class="mr-1 mb-1"
                        @click="[color, selectedSwatchIndex] = [col, index]"
                    >
                        <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                    </v-btn>
                </div>

                <div style="float: right">
                    <v-btn
                        color="primary" variant="text" class="mr-4"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :disabled="!name || name.length === 0"
                        :loading="loading" variant="text" color="primary"
                        @click="submit()"
                    >
                        {{ verb }}
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
import { BOARD_SWATCHES } from '~/helpers/board/board-colors.js';

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        tag: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            showModal: this.show,
            loading: false,

            // Colors + data
            swatches: Object.freeze(BOARD_SWATCHES),
            selectedSwatchIndex: 0,
            color: this.tag ? this.tag.color : '',
            name: this.tag ? this.tag.name : ''
        }
    },
    computed: {
        isEdit() { return Object.keys(this.tag).length > 0; },
        verb() { return this.isEdit ? 'Edit' : 'Create'; }
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
            if (newVal) {
                this.color = (this.tag && this.tag.color !== '#FFFFFF') ? this.tag.color : '';
                this.selectedSwatchIndex = Math.max(this.swatches.indexOf(this.color), 0);
                this.name = this.tag ? this.tag.name : '';
            }
        }
    },
    methods: {
        async submit() {
            let opts =  {
                name: this.name,
                color: this.color || '#FFFFFF'
            };
            if (this.isEdit)
                opts.id = this.tag.id;

            this.loading = true;
            try {
                await this.$fetchApi('/api/board/tags', this.isEdit ? 'PUT' : 'POST', opts);
                this.$emit('success', 'Tag ' + this.verb.toLowerCase() + ' successful!');
            } catch (e) {
                let errorMsg = `Failed to ${this.verb.toLowerCase()} tag: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            this.$emit('update', opts);
            this.loading = false;
        }
    }
}
</script>
