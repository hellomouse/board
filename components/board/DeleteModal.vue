<!--
Wrapper for delete confirmation modal for boards

Example usage:
<BoardDeleteModal
    :show="deleteBoardModal"    Show / hide modal
    :board="currentBoard"       Must contain "id" and "name" prop

    @update="onBoardUpdate"     Emits board_delete on success and close_board_delete to close modal
    @error="e => [toastErrorMsg, showErrorToast] = [e, true]"
    @success="e => [toastSuccessMsg, showSuccessToast] = [e, true]"
/>
-->

<template>
    <DeleteConfirmation
        :show="show"
        title="Delete Board"
        :loading="deleteModalLoading"
        :confirmation-string="board.name || ''"
        @update="die => deleteBoard(die)"
    >
        <p>
            Are you sure you want to delete this board?
            This will delete the board <b>and all {{ board.pin_count }} pin(s)</b> associated
            with the board and <b>cannot be undone!</b>
        </p>
    </DeleteConfirmation>
</template>


<script>
export default {
    name: 'BoardDeleteModal',
    props: {
        board: {
            type: Object,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    data: () => ({
        deleteModalLoading: false
    }),
    methods: {
        async deleteBoard(shouldDelete) {
            if (!shouldDelete) {
                this.$emit('update', { type: 'close_board_delete' });
                return;
            }

            this.deleteModalLoading = true;
            try {
                await this.$fetchApi('/api/board/boards', 'DELETE', { id: this.board.id });
                this.$emit('update', { type: 'board_delete' });
            } catch (e) {
                let errorMsg = `Failed to delete board: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }

            this.$emit('update', { type: 'close_board_delete' });
            this.deleteModalLoading = false;
        }
    }
}
</script>
