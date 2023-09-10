<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-2">
                <h1 class="mb-2">Add / Remove Boards</h1>
                
                <BoardList
                    v-model:selected="board_ids"
                    class="mb-4" multiple
                    :height="250"
                    :filter-can-edit="false"
                    :include-shared-boards="false"
                />

                <div style="float: right">
                    <v-btn
                        color="primary" variant="text" class="mr-4"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :loading="loading" variant="text" color="primary"
                        @click="submit()"
                    >
                        Ok
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
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
            board_ids: this.tag.board_ids
        }
    },
    watch: {
        show(newVal) { this.showModal = newVal; },
        tag(newVal) { this.board_ids = newVal.board_ids; }
    },
    methods: {
        async submit() {
            let opts = {
                name: this.tag.name,
                color: this.tag.color || '#FFFFFF',
                board_ids: this.board_ids,
                id: this.tag.id
            };

            this.loading = true;
            try {
                await this.$fetchApi('/api/board/tags', 'PUT', opts);
                this.$emit('success', 'Tag edit successful!');
            } catch (e) {
                let errorMsg = `Failed to edit tag: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            this.$emit('update', opts);
            this.loading = false;
        }
    }
}
</script>
