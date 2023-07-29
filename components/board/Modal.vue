

<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500" max-width="500" class="py-4">
            <v-card-text>
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
                    density="compact"
                    :color="col" class="mr-1 mb-1"
                    @click="[color, selectedSwatchIndex] = [col, index]"
                >
                    <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                </v-btn>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="$emit('update', false)">Cancel</v-btn>
                <v-btn color="primary" :loading="loading" @click="createBoard">{{ editMode ? 'Apply' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
const swatches =
    '#F44336,#E91E63,#9C27B0,#673AB7,#3F51B5,#2196F3,#03A9F4,#009688,#4CAF50,#8BC34A,#CDDC39,#FFC107,#FF9800,#FF5722,#607D8B'.split(',');

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
            name: this.board.name,
            description: this.board.desc,
            color: this.board.color,
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
            this.description = this.board.desc;
            this.color = this.board.color || swatches[0];
            this.name = this.board.name;
            this.selectedSwatchIndex = swatches.indexOf(this.color.toUpperCase()) || 0;
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
                let errorMsg = `Failed to modify board: ${this.$apiErrorToString(e)}`;
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
