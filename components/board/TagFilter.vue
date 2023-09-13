<template>
    <v-sheet
        elevation="0"
        width="250"
        class="tag-tile hoverable [ mr-3 mb-3 ]"
        :class="selected ? 'selected' : ''"
    >
        <div
            class="pl-4 pr-1 py-1"
            style="cursor: pointer"
            @click="clickHandler"
        >
            <div class="text-truncate d-flex align-center">
                <v-icon :color="color" size="small" class="mr-2">mdi-tag</v-icon>
                {{ name }}

                <v-spacer />
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn
                            density="comfortable"
                            icon="mdi-dots-vertical"
                            v-bind="props"
                            class="board-tile__menu"
                            flat color="transparent"
                        ></v-btn>
                    </template>
                
                    <v-sheet elevation="8" rounded="0">
                        <button
                            class="px-4 hoverable hover-list-item edit-list-item"
                            @click="$emit('edit', tag)"
                        >
                            <v-icon icon="mdi-pencil" />Edit
                        </button>
                        <button
                            class="px-4 hoverable hover-list-item edit-list-item"
                            @click="$emit('add-remove-boards', tag)"
                        >
                            <v-icon icon="mdi-view-dashboard-edit" />Add / Remove Boards
                        </button>
                        <button
                            class="px-4 text-red [ hoverable hover-list-item ] [ edit-list-item edit-list-item--line ]"
                            @click="$emit('delete', { id: tag.id, name: tag.name })"
                        >
                            <v-icon icon="mdi-trash-can" color="red" />Delete
                        </button>
                    </v-sheet>
                </v-menu>
            </div>
        </div>
    </v-sheet>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: 'No title provided'
        },
        color: {
            type: String,
            default: ''
        },
        tag: {
            type: Object,
            default: () => ({})
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            numClicks: 0
        };
    },
    methods: {
        clickHandler() {
            this.numClicks++;
            if (this.numClicks === 1) {
                let self = this;
                setTimeout(() => {
                    if (self.numClicks === 1) { // Single click: select
                        this.$emit('update:selected', !self.selected);
                        this.$emit('select', { id: this.tag.id, select: !self.selected });
                    }
                    else                       // Double click: filter
                        this.$emit('filter', this.tag);
                    self.numClicks = 0;
                }, 200);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/dropdown-menu.scss";

.tag-tile {
    max-width: 100%;
    display: inline-block;
    outline-offset: -1px;
    user-select: none;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

    &.selected {
        outline: 1px solid rgb(var(--v-theme-on-surface)) !important;
    }
}
</style>
