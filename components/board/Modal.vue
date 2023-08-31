<!--
The create + edit board modal

Example usage:

<BoardModal
:edit-mode="editBoard"    true for edit, false for create
:show="createBoardModal"  show modal or not?
:board="currentBoard"     Board data to fill in edit, or {} for create

@update="onBoardCreate"
@error="e => [toastErrorMsg, showErrorToast] = [e, true]"
/>
-->

<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500" class="py-2">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">{{ editMode ? 'Edit' : 'Create' }} Board</h1>

                <v-text-field
                    v-model="name" density="compact" class="mb-2" label="Name"
                    oninput="this.value = this.value.substring(0, 60)"
                    rounded="0" variant="solo-filled"></v-text-field>
                <v-textarea
                    v-model="description" density="compact" class="mb-4" label="Description"
                    oninput="this.value = this.value.substring(0, 300)"
                    rounded="0" variant="solo-filled"></v-textarea>

                <v-btn
                    v-for="(col, index) in swatches" :key="col"
                    density="compact" width="40" style="min-width: 40px;"
                    :color="col" class="mr-1 mb-1"
                    @click="[color, selectedSwatchIndex] = [col, index]"
                >
                    <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                </v-btn>
            </v-card-text>
            <v-card-actions class="mr-3">
                <v-spacer />
                <v-btn color="primary" @click="$emit('update', false)">Cancel</v-btn>
                <v-btn color="primary" variant="elevated" :loading="loading" @click="createBoard">{{ editMode ? 'Apply' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { BOARD_SWATCHES } from '~/helpers/board/board-colors.js';

export default {
    name: 'BoardModal',
    props: {
        editMode: { // Edit existing board instead of create
            type: Boolean,
            default: false
        },
        board: {
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
            name: this.board?.name,
            description: this.board?.desc,
            color: this.board?.color,
            loading: false,

            swatches: BOARD_SWATCHES,
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
            this.description = this.board?.desc || 'Default description';
            this.color = this.board?.color || swatches[0];
            this.name = this.board?.name;
            this.selectedSwatchIndex = Math.max(0, swatches.indexOf(this.color.toUpperCase()));
        }
    },
    methods: {
        async createBoard() {
            if (!this.name) {
                this.$emit('error', 'Name cannot be empty');
                return;
            }
            if (!this.description) {
                this.$emit('error', 'Description cannot be empty');
                return;
            }

            let params = {
                name: this.name,
                desc: this.description,
                color: this.color,
            };

            // Creation requires perms, editing requires id
            if (!this.editMode) params.perms = {};
            else                params.id = this.board.id;

            this.loading = true;
            try {
                await this.$fetchApi('/api/board/boards', this.editMode ? 'PUT' : 'POST', params);
            } catch (e) {
                let errorMsg = `Failed to ${this.editMode ? 'modify' : 'create'} board: ${this.$apiErrorToString(e)}`;
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
