<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    middleware: 'auth'
});
</script>

<template>
    <div class="container">
        <h1>User Settings</h1>
        <br>

        <h2>Profile Picture</h2>
        <p>Pictures will automatically be cropped to fit a square. PNG/JPG/WEBP only.</p>
        <br>

        <div class="d-flex" style="align-items: center;">
            <img
                :key="img_key"
                :src="`/api/files/pfp?id=${userId}${img_key}`"

                width="80" height="80"
                class="pfp-preview mr-5"
                @error="$event.target.src = '/default-pfp.png'"
            />
            <v-file-input 
                ref="fileInput"
                v-model="selected_files"
                accept=".png,.jpg,.jpeg,.webp"
                label="Profile Picture" variant="solo-filled"
                show-size rounded=0
                density="compact" style="min-height: 47px;"
                clearable counter class="mt-2 mb-2"
                @change="onUploadPFP"
            />
        </div>

        <!-- Toasts for errors / success -->
        <v-snackbar 
            v-model="showErrorToast" color="error" rounded="0" theme="dark"
            transition="scroll-y-reverse-transition">
            {{ toastErrorMsg }}
        </v-snackbar>
        <v-snackbar
            v-model="showSuccessToast" color="success" rounded="0" theme="dark" timeout="2000"
            transition="scroll-y-reverse-transition">
            {{ toastSuccessMsg }}
        </v-snackbar>
    </div>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';

export default {
    data() {
        return {
            selected_files: [],
            img_key: '',

            // Toasts
            showErrorToast: false,
            showSuccessToast: false,
            toastErrorMsg: '',
            toastSuccessMsg: '',
        };
    },
    computed: {
        userId() {
            return useAuthStore(this.$pinia).user.id;
        }
    },
    methods: {
        showError(msg) { [this.showErrorToast, this.toastErrorMsg] = [true, msg]; },
        showSuccess(msg) { [this.showSuccessToast, this.toastSuccessMsg] = [true, msg]; },
        async onUploadPFP() {
            if (!this.selected_files.length) {
                this.showError('You must upload at least one file');
                return;
            }

            let formData = new FormData();
            for (let file of this.selected_files)
                formData.append('files', file, file.name);

            let requestOptions = {
                method: 'POST',
                mode: 'cors',
                headers: { 'enctype': 'multipart/form-data' },
                body: formData,
                connection: 'close',
                credentials: 'include',
                signal: AbortSignal.timeout(15000)
            };
            this.showSuccess(`Uploading file... please wait...`);

            try {
                // eslint-disable-next-line no-undef
                let results = await $fetch('/api/files/pfp', requestOptions);
                if (results.error)
                    this.showError(`Failed to upload profile picture`);
                else {
                    this.showSuccess(`Uploaded profile picture`);
                    this.img_key = '&err=' + Math.random();
                }
            } catch(e) {
                this.showError(`Failed to upload profile picture`);
            }
            this.selected_files = [];
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 700px;
    margin: 0 auto;
}

.pfp-preview {
    border-radius: 50%;
}
</style>
