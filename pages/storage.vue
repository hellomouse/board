<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    middleware: 'auth'
});
</script>

<template>
    <div class="storage-container">
        <h1>Storage</h1>
        <br>

        <h2 style="font-weight: normal">
            {{ $formatStorage(bytesUsed) }}
            <small>Used in current files displayed</small>
        </h2>
        <v-progress-linear :model-value="fileBarProgress"></v-progress-linear>
        <br>

        <v-table fixed-header density="compact">
            <thead>
                <tr>
                    <th class="text-left">Files</th>
                    <th class="text-left">Storage used</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="file in files" :key="file.id">
                    <td>
                        <v-icon size="small" class="mr-3">{{ getFileIcon(file.file_extension) }}</v-icon>
                        <a :href="`/api/files/single?id=` + file.id" style="text-decoration: none">
                            {{ file.file_name }}.{{ file.file_extension }}
                        </a>
                    </td>
                    <td style="width: 120px" class="text-right">
                        {{ $formatStorage(file.file_size) }}
                    </td>
                    <td style="width: 50px">
                        <v-btn 
                            density="compact" icon="mdi-close-octagon"
                            @click="attachmentToDelete = [file.id, `${file.file_name}.${file.file_extension}`]; deleteAttachmentModal = true"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-if="hasMore && files.length > 0" class="text-center">
            <v-btn class="my-2" :loading="loading" @click="getFiles()">
                Load More
            </v-btn>
        </div>

        <div class="text-center mt-10">
            <h1>{{ stateMsg }}</h1>
        </div>

        <lazy-pin-delete-attachment-modal
            :show="deleteAttachmentModal" :file-name-and-id="attachmentToDelete"
            title="Delete File" desc="Note that this will not remove any attachment links in pins, which could lead to dead links,"
            @update="deleteAttachmentModal = false; filterAfterDelete();"
            @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
            @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]" />

        <!-- Toasts for errors / success -->
        <v-snackbar v-model="showErrorToast" color="error" rounded="0" theme="dark"
            transition="scroll-y-reverse-transition">
            {{ toastErrorMsg }}
        </v-snackbar>
        <v-snackbar v-model="showSuccessToast" color="success" rounded="0" theme="dark" timeout="2000"
            transition="scroll-y-reverse-transition">
            {{ toastSuccessMsg }}
        </v-snackbar>
    </div>
</template>

<script>
const FILE_CHUNK_SIZE = 100;

export default {
    data() {
        return {
            files: [],
            stateMsg: 'Loading...',
            fileIdx: 0,
            hasMore: true,
            loading: false,

            deleteAttachmentModal: false,
            attachmentToDelete: [],

            // Toasts
            showErrorToast: false,
            showSuccessToast: false,
            toastErrorMsg: '',
            toastSuccessMsg: '',
        };
    },
    computed: {
        bytesUsed() {
            let sizes = this.files.map(x => x.file_size);
            if (!sizes.length) return 0;
            return sizes.reduce((a, b) => a + b);
        },
        fileBarProgress() {
            return Math.min(100, this.bytesUsed * 100 / (1024 * 1024 * 1024 * 16)); // 16 GB
        }
    },
    mounted() { this.getFiles(); },
    destroyed() {},
    methods: {
        async getFiles() {
            try {
                this.loading = true;
                let result = await this.$fetchApi('/api/files', 'GET', {
                    offset: this.fileIdx,
                    limit: FILE_CHUNK_SIZE
                });
                this.files = this.files.concat(result);
                this.hasMore = result.length === FILE_CHUNK_SIZE;
                this.fileIdx += result.length;
                this.stateMsg = this.files.length === 0 ? 'You have no files!' : '';
            } catch(e) {
                console.error(e);
                this.stateMsg = 'Error loading files';
            }
            this.loading = false;
        },
        filterAfterDelete() {
            this.files = this.files.filter(f => f.id !== this.attachmentToDelete[0]);
            this.attachmentToDelete = [];
        },
        getFileIcon(ext) {
            ext = ext.toLowerCase();
            if (['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(ext))
                return 'mdi-image';
            if (['gz', 'tar', 'zip', '7z'].includes(ext))
                return 'mdi-archive';
            if (ext === 'pdf')
                return 'mdi-file-pdf-box';
            if (['mp3', 'wav', 'opus', 'ogg', '3gp', 'aa', 'alac', 'm4a', 'm4b', 'wma', 'webm'].includes(ext))
                return 'mdi-volume-medium';
            if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'mpeg', 'flv'].includes(ext))
                return 'mdi-video';
            if (['doc', 'docx', 'txt'].includes(ext))
                return 'mdi-text-box';
            return 'mdi-file';
        }
    }
}
</script>

<style lang="scss" scoped>
.storage-container {
    max-width: 1000px;
    margin: 0 auto;
}

.file-size-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>
