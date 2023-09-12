<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-2">
                <h1 class="mb-2">Move to Tag</h1>

                <v-text-field
                    v-model="searchVal"
                    label="" rounded="0"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search Tags"
                    class="my-2"
                    density="compact"
                    clearable block
                    flat variant="solo-filled"
                />

                <v-list density="compact" style="max-height: 200px">
                    <v-list-subheader>TAGS</v-list-subheader>
                    <v-list-item
                        v-for="tag in filteredTags"
                        :key="tag.id"
                        color="primary"

                        :title="tag.name"
                        :subtitle="tag.board_ids.length + ' Boards'"
                        :active="selectedTagIds.has(tag.id)"

                        @click="toggleTag(tag.id)"
                    >
                        <template #prepend>
                            <v-icon icon="mdi-tag" :color="tag.color"></v-icon>
                        </template>
                    </v-list-item>
                </v-list>

                <div style="float: right">
                    <v-btn
                        color="primary" variant="text" class="mr-4"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :disabled="!selectedTagIds.size"
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
        tags: {
            type: Array,
            default: () => []
        },
        boardId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showModal: this.show,
            loading: false,
            searchVal: '',
            selectedTagIds: new Set()
        }
    },
    computed: {
        filteredTags() {
            if (!this.searchVal || !this.searchVal.length) return this.tags;
            return this.tags.filter(t => t.name.toLowerCase().includes(this.searchVal.toLowerCase()))
        }
    },
    watch: {
        show(newVal) { this.showModal = newVal; }
    },
    methods: {
        async submit() {
            if (this.selectedTagIds.size) {
                this.loading = true;
                let opts = {
                    to_tag_id: [...this.selectedTagIds][0],
                    board_id: this.boardId
                };

                try {
                    await this.$fetchApi('/api/board/tags/move', 'POST', opts);
                    this.$emit('success', 'Move successful!');
                } catch (e) {
                    let errorMsg = `Failed to move folder: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }

                this.$emit('update', opts);
                this.loading = false;
                return;
            }
            this.$emit('update', false);
        },
        toggleTag(id) {
            let has = this.selectedTagIds.has(id);
            this.selectedTagIds = new Set(has ? [] : [id]);
        }
    }
}
</script>
