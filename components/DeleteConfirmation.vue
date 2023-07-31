<!--
A modal where you have to type a string to confirm a deletion
Example usage:

<DeleteConfirmation
    title="Delete Board"                Title of modal
    v-model="deleteModal"               Whether to show
    :loading="deleteModalLoading"       Whether to display loading on delete button
    :confirmation-string="title"        String to type
    @update="realDelete => ..."         Whether delete should begin 
>
    ... Modal stuff ...
</DeleteConfirmation>

-->

<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-8">
                <h1 class="mb-4 text-truncate">{{ title }}</h1>
                <slot></slot>
                
                <br>
                <p>Type <span class="text-primary">{{ confirmationString }}</span> to confirm deletion</p>
                <v-text-field
                    v-model="inputString"
                    :placeholder="confirmationString" rounded="0"
                    density="compact"
                    class="mt-2 mb-10"
                    variant="solo-filled"
                    @keyup.enter="() => { if (inputString === confirmationString) $emit('update', true) }"
                />

                <div style="float: right">
                    <v-btn
                        color="primary" variant="text"
                        class="mr-4"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :loading="loading"
                        color="red" :disabled="inputString !== confirmationString"
                        @click="$emit('update', true)"
                    >
                        Delete
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DeleteConfirmation',
    props: {
        title: {
            type: String,
            required: true
        },
        confirmationString: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        inputString: ''
    }),
    computed: {
        showModal: {
            get() { return this.show; },
            set(val) { this.$emit('show', val); }
        }
    },
    watch: {
        show(newVal, _oldVal) {
            if (!newVal)
                this.inputString = ''; // Clear on close
        }
    }
}
</script>
