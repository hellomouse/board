<template>
    <v-dialog
        v-model="dialog"
        width="auto"
    >
        <template #activator="{ props }">
            <v-btn
                color="red"
                v-bind="props"
                block
            >
                <v-icon icon="mdi-plus" /> New Board
            </v-btn>
        </template>

        <v-card rounded="0" title="New Board">
            <v-card-text>
                <v-text-field
                    v-model="name" density="compact" class="mb-2" label="Name"
                    rounded="0" variant="solo-filled"></v-text-field>
                <v-textarea
                    v-model="description" density="compact" class="mb-2" label="Description"
                    rounded="0" variant="solo-filled"></v-textarea>

                TODO: pick from swatches
                <v-color-picker v-model="color" rounded="0" mode="hex"></v-color-picker>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" :loading="loading" @click="createBoard">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'NewBoardBtn',
    data() {
        return {
            dialog: false,
            loading: false,
            error_msg: '',

            name: '',
            description: '',
            color: '#FFFFFF'
        }
    },
    methods: {
        async createBoard() {
            this.loading = true;
            console.log(this.name, this.description, this.color);

            let requestOptions = {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    name: this.name,
                    desc: this.description,
                    color: this.color,
                    perms: {}
                }),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            }; // TODO: make plugin

            try {
                // eslint-disable-next-line no-undef
                await $fetch('/api/board/boards', requestOptions);
            } catch (e) {
                this.error_msg = (e + '').includes('40') ?
                    'Failed to create board' :
                    'Error to create board';
                this.loading = false;
                return;
            }

            this.dialog = false;
            this.loading = false;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

</style>
