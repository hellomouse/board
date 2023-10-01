<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-tabs
                v-model="tab"
                class="small-tabs"
                align-tabs="right"
            >
                <v-tab value="1"><v-icon icon="mdi-link" class="mr-2" />From URLs</v-tab>
                <v-tab value="2"><v-icon icon="mdi-file" class="mr-2" />From file</v-tab>
            </v-tabs>

            <v-card-text class="mb-2 text">
                <h1 class="mb-2">Add Song{{tab === '1' ? '(s)' : ''}}</h1>

                <v-window v-model="tab">
                    <v-window-item value="1">
                        <p>Insert a list of urls (one per line) to add songs from. Supported sites are <b>Youtube,
                            Bilibili, Soundcloud, and Newgrounds
                        </b></p>

                        <v-textarea
                            v-model="links" density="compact" class="my-4" label="Links"
                            rounded="0" variant="solo-filled"></v-textarea>

                        <p
                            v-if="linkCount > MAX_LINKS"
                            class="text-red"
                        >Please limit total links to {{ MAX_LINKS }} (You have {{ linkCount }})</p>
                    </v-window-item>

                    <v-window-item value="2">
                        <v-file-input
                            rounded="0" class="mb-2 required"
                            accept="audio/*" density="compact"
                            label="Audio file"
                        ></v-file-input>

                        <v-text-field
                            v-model="name" density="compact" class="mb-2 required" label="Artist"
                            oninput="this.value = this.value.substring(0, 128)"
                            rounded="0" variant="solo-filled"></v-text-field>
                        <v-text-field
                            v-model="name" density="compact" class="mb-2 required" label="Title"
                            oninput="this.value = this.value.substring(0, 1024)"
                            rounded="0" variant="solo-filled"></v-text-field>
                        <v-textarea
                            v-model="links" density="compact" class="mb-2" label="Description"
                            oninput="this.value = this.value.substring(0, 16192)"
                            rounded="0" variant="solo-filled"></v-textarea>
                        <v-textarea
                            v-model="links" density="compact" class="mb-4" label="Lyrics"
                            oninput="this.value = this.value.substring(0, 16192)"
                            rounded="0" variant="solo-filled"></v-textarea>
                    </v-window-item>
                </v-window>

                <div style="float: right">
                    <v-btn
                        color="primary" variant="text" class="mr-4"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :disabled="(tab === '1' && (linkCount > MAX_LINKS || linkCount === 0))"
                        :loading="loading" variant="text" color="primary"
                        @click="submit()"
                    >
                        Add
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
const MAX_LINKS = 1000;

export default {
    props: {
        show: {
            type: Boolean,
            required: true
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
            links: '',
            tab: '1',

            MAX_LINKS
        }
    },
    computed: {
        linkCount() { return this.links.split('\n').length; }
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
        }
    },
    methods: {
        async submit() {
            let opts =  { id: this.playlistId };
            if (this.tab === '1')
                opts.song_urls = this.links.split('\n');

            this.loading = true;
            try {
                await this.$fetchApi('/api/music/playlist/song/url', 'POST', opts);
                this.$emit('success', 'Songs added!');
            } catch (e) {
                let errorMsg = `Failed to add songs: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.$emit('update', true);
            this.loading = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.text {
    margin-top: -10px;
}

.small-tabs {
    transform: scale(0.75);
    transform-origin: top left;
}
</style>