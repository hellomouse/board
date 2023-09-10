
<template>
    <v-dialog
        v-model="showModal"
        width="620"
    >
        <v-card rounded="0" width="620" class="py-1">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">Copy to board</h1>

                <BoardList
                    v-model:selected="selectedBoardId"
                    :filter-can-edit="true"
                />

                <div class="d-flex mt-2">
                    <v-spacer />
                    <v-btn variant="text" color="primary" @click="$emit('update', { type: 'close' })">Cancel</v-btn>
                    <v-btn 
                        :disabled="selectedBoardId.length === 0 || !selectedBoardId"
                        variant="text" color="primary" @click="performCopy()">Copy</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { pinTypeNameToNumber } from '~/helpers/board/pin.js';

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        pin: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showModal: this.show,
            selectedBoardId: []
        };
    },
    watch: {
        show(newVal) { this.showModal = newVal; }
    },
    methods: {
        async performCopy() {
            try {
                await this.$fetchApi('/api/board/pins', 'POST', {
                    pin_type: pinTypeNameToNumber(this.pin.type),
                    board_id: this.selectedBoardId[0],
                    flags: this.pin.flags || '',
                    content: this.pin.content,
                    attachment_paths: this.pin.attachment_paths,
                    metadata: this.pin.metadata
                });
                this.$emit('success', 'Pin copied to board!');
            } catch (e) {
                let errorMsg = `Failed to copy pin to board: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.$emit('update', { type: 'close' });
        }
    }
}
</script>
