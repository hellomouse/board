<template>
    <div class="attachments-container">
        <b>Attachments:</b>
        <div v-for="p in splitAttachmentPaths" :key="p[0]" class="attachment-row">
            <a :href="`/api/files/single?id=${p[0]}`" class="text-truncate attachment-row-link">
                <v-icon icon="mdi-link" size="x-small" />
                {{ p[1] }}
            </a>
            <v-btn
                v-if="allowEdit" class="attachment-row-btn" density="compact"
                size="x-small" icon="mdi-close-octagon"
                @click="$emit('deleteAttachmentModal', p)"
            ></v-btn>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        files: {
            required: true,
            type: Array,
        },
        allowEdit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        splitAttachmentPaths() {
            return this.files.map(x => {
                const index = x.indexOf(',');
                return [x.slice(0, index), x.slice(index + 1)];
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.attachments-container {
    margin-top: 10px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    opacity: 0.9;
    padding: 10px;
    font-size: 0.9rem;
    overflow-y: auto;
    overflow-x: auto;
    max-height: 140px;
}

.attachment-row {
    display: flex;
    justify-content: space-between;

    .attachment-row-link {
        display: inline-block;
        max-width: 90%;
    }

    .attachment-row-btn {
        margin-top: 3px;
    }
}
</style>