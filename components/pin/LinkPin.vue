<!--
Example usage:

TODO

Content format:
    1st line: url
    2nd line: note with newlines removed
    3rd line: url for image
    4th line: page title
    5th line: page desc
    6th line: id of downloaded content, or none
-->

<template>
    <div class="container">
        <v-text-field
            v-model="url"
            label="URL" density="compact" rounded="0" variant="solo-filled"
            class="mb-2"
        />

        <v-textarea
            v-model="desc"
            label="Note" variant="solo-filled" rounded="0" auto-grow
            :counter="200"
            :rules="rules"
            @input="desc = desc.replaceAll('\n', '').slice(0, 200)"
        />

        <p v-if="hasDownloadedContent" class="text-yellow mt-2">
            This pin already has downloaded content, downloading again make the old content inaccessible (you can still view it from Storage)
        </p>

        <v-checkbox
            v-model="downloadWebsite"
            label="Download website (Counts towards storage quota)" color="red"
        />

        <div class="download-strategy" :class="!downloadWebsite ? 'download-strategy--disabled' : ''">
            <v-label class="mr-4">Download Strategy:</v-label>

            <v-btn-toggle
                v-model="downloadStrategy"
                density="compact" rounded="0"
                color="primary"
                mandatory
            >
                <v-btn>HTML</v-btn>
                <v-btn>PDF</v-btn>
                <v-btn>Media</v-btn>
            </v-btn-toggle><br>

            <small style="cursor: pointer" @click="infoModal = true">What do these options mean?</small>
            <br><br>
        </div>

        <v-dialog
            v-model="infoModal"
            width="500"
        >
            <v-card rounded="0">
                <v-card-text>
                    <v-alert
                        text="Only the page at the link will be downloaded; this does not crawl the site" type="info"
                        rounded="0"
                    /><br>

                    <h2>HTML</h2>
                    <p>
                        Downloads the website encoding everything into a single HTML file. Saves basic layout and images,
                        but may break on modern or interactive sites (such as the new Reddit). You can browse this downloaded
                        page like a regular web page.
                    </p>
                    <br>

                    <h2>PDF</h2>
                    <p>
                        This downloads the website as if you printed the page from your browser. Recommended if you
                        wish to preserve the text and appearance of the site, but assets like images will be harder to download.
                    </p>

                    <br>
                    <h2>Media</h2>
                    <p>
                        This uses a hard-coded set of rules to download content from certain websites (otherwise defaults to HTML). Supported websites are:

                        <ul class="ml-10">
                            <li><b>Youtube:</b> Downloads videos and video metadata</li>
                            <li><b>Twitter:</b> Downloads tweet content + metadata</li>
                            <li><b>Soundcloud / Newgrounds:</b> Downloads music + metadata</li>
                            <li><b>Reddit:</b> Downloads post and media</li>
                            <li><b>Imgur / Pixiv:</b> Downloads images</li>
                        </ul>
                        <br>
                        Please note for the sites above, it will not save the entire page, only relevant data (ie it will only save
                        the text of a post, and not the CSS / website layout).
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="infoModal = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            required: true,
            type: String
        },
        downloadOptions: {
            required: true,
            type: Object
        }
    },
    data() {
        const lines = this.content.split('\n');
        return {
            url: lines[0] || '',
            desc: lines[1] || '',
            hasDownloadedContent: lines[5] ? true : false,
            downloadWebsite: false,
            rules: [v => v && (v.length <= 200 || 'Max 200 characters')],
            downloadStrategy: 0,
            infoModal: false
        };
    },
    watch: {
        url() { this.emitContentUpdate(); },
        desc() { this.emitContentUpdate(); },

        downloadWebsite() { this.emitDownloadUpdate(); },
        downloadStrategy() { this.emitDownloadUpdate(); }
    },
    methods: {
        emitContentUpdate() {
            this.$emit('update:content', `${this.url.replaceAll('\n', '')}\n${this.desc.replaceAll('\n', '')}`);
        },
        emitDownloadUpdate() {
            this.$emit('update:downloadOptions', this.downloadWebsite ? {
                url: this.url,
                strategy: ['html', 'pdf', 'media'][this.downloadStrategy]
            } : {});
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 10px;
    background-size: cover !important;
    background-position: center !important;
}

.download-strategy {
    transition: opacity 0.2s;
    margin-left: 40px;
    margin-top: -10px;
}

.download-strategy--disabled {
    pointer-events: none;
    opacity: var(--v-disabled-opacity);
}
</style>