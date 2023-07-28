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
                <v-text-field density="compact" class="mb-2" label="Name" rounded="0" variant="solo-filled"></v-text-field>
                <v-textarea density="compact" class="mb-2" label="Description" rounded="0" variant="solo-filled"></v-textarea>

                TODO: pick from swatches
                <v-color-picker rounded="0" mode="hex"></v-color-picker>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="dialog = false">Create</v-btn>
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
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

</style>
