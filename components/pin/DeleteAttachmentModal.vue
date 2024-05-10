<!--
Wrapper for delete confirmation modal for pin attachments

Example usage:
<PinDeleteAttachmentModal
    :show="deleteAttachmentModal" Show / hide modal
    :board="currentBoard"         Must contain "id" and "name" prop

    @update="onBoardUpdate"       Emits board_delete on success and close_board_delete to close modal
    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
/>
-->

<template>
    <DeleteConfirmation
        :show="show"
        :title="title"
        :loading="deleteModalLoading"
        :confirmation-string="''"
        @update="die => deleteAttachment(die)"
    >
        <p>
            Are you sure you want to remove the attachment: <code>{{ fileNameAndId[1] }}</code>?
            {{ desc }} and <b>cannot be undone!</b>
        </p>
    </DeleteConfirmation>
</template>


<script>
export default {
    name: 'PinDeleteAttachmentModal',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        fileNameAndId: {
            type: Array,
            required: true
        },

        title: {
            type: String,
            default: 'Delete Attachment'
        },
        desc: {
            type: String,
            default: 'This will also delete the file from the server'
        }
    },
    data: () => ({
        deleteModalLoading: false
    }),
    methods: {
        async deleteAttachment(shouldDelete) {
            if (!shouldDelete) {
                this.$emit('update', { type: 'close_attachment_delete' });
                return;
            }

            this.deleteModalLoading = true;
            try {
                await this.$fetchApi('/api/files/single', 'DELETE', { id: this.fileNameAndId[0] });
            } catch (e) {
                let errorMsg = `Failed to delete file: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            this.$emit('attachmentRemoved', this.fileNameAndId);
            this.$emit('update', { type: 'close_attachment_delete' });
            this.deleteModalLoading = false;
        }
    }
}
</script>
