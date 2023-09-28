<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-2">
                <h1 class="mb-2">{{ verb }} Playlist</h1>
                <v-text-field
                    v-model="name" density="compact" class="mb-4" label="Name"
                    oninput="this.value = this.value.substring(0, 60)"
                    rounded="0" variant="solo-filled"></v-text-field>

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
export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        initialName: {
            type: String,
            default: ''
        },
        playlistId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showModal: this.show,
            loading: false,
            name: this.initialName
        }
    },
    computed: {
        isEdit() { return this.playlistId.length > 0; },
        verb() { return this.isEdit ? 'Edit' : 'Create'; }
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
            if (newVal) this.name = this.initialName;
        }
    },
    methods: {
        async submit() {
            let opts =  { name: this.name };
            if (this.playlistId)
                opts.id = this.playlistId;

            this.loading = true;
            try {
                let result = await this.$fetchApi('/api/music/playlist', this.isEdit ? 'PUT' : 'POST', opts);
                opts.id = opts.id || result.id;
                this.$emit('success', 'Playlist ' + this.verb.toLowerCase() + ' successful!');
            } catch (e) {
                let errorMsg = `Failed to ${this.verb.toLowerCase()} playlist: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            if (this.playlistId)
                opts.wasEdit = true;

            this.$emit('update', opts);
            this.loading = false;
        }
    }
}
</script>
