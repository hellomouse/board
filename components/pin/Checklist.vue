<!--
Example usage:
<pin-checklist
    v-model="checklist"
    @deleteElement="e => checkList = checkList.filter(i => i !== e)"
    @pushHistory="Indicate change of values in checklist"
/>
-->

<template>
    <draggable
        :list="checklist_mut"
        item-key="id"
        class="pb-4"
        v-bind="dragOptions"
    >
        <template #item="{ element }">
            <div
                class="d-flex checklist-item"
                :class="elementClass(element)"
                @click="selectElement(element)"
            >
                <v-icon
                    v-if="!simple"
                    class="checklist-drag" icon="mdi-drag"
                    @mouseenter="canDrag = true"
                    @mouseleave="canDrag = false"
                />
                <v-checkbox-btn
                    v-model="element.checked"
                    class="checklist-checkbox"
                    label=""
                    @click="emitCheck"
                />
                <resizeable-textarea
                    v-if="!simple"
                    :value="element.value"
                    type="text"
                    class="checklist-input"
                    placeholder="Edit item"
                    @focusout="v => { element.value = v.target.value; $emit('pushHistory'); }"
                />
                <p
                    v-if="simple"
                    class="checklist-input"
                >{{ element.value }}</p>
                <v-btn
                    v-if="!simple"
                    color="transparent"
                    class="checklist-btn" icon="mdi-close" flat
                    @click="removeElement(element)"
                />
            </div>
        </template>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';

export default {
    components: { draggable },
    props: {
        checklist: {
            required: true,
            type: Array
        },
        simple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            checklist_mut: this.checklist,
            canDrag: false,
            selected: []
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                disabled: !this.canDrag || this.simple,
                ghostClass: 'ghost'
            };
        }
    },
    watch: {
        checklist_mut() {
            this.$emit('update:checklist', this.checklist_mut);
        }
    },
    methods: {
        elementClass(element) {
            let classes = [];
            if (element.checked)
                classes.push('checklist-item--completed')
            if (element.selected && !this.simple)
                classes.push('checklist-item--selected');
            return classes;
        },
        selectElement(element) {
            this.selected.forEach(e => delete e.selected);
            this.selected = [];
            element.selected = true;
            this.selected = [element];
        },
        removeElement(element) {
            this.$emit('deleteElement', element);
        },
        emitCheck() {
            setTimeout(() => this.$emit('check', this.checklist_mut), 5);
        }
    }
}
</script>

<style lang="scss" scoped>
$checklist-item-height: 25px;

.checklist-item {
    min-height: $checklist-item-height;
    align-items: middle;

    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    transition: border 0.2s;

    &.checklist-item--completed {
        opacity: var(--v-disabled-opacity);
        textarea, p {
            text-decoration: line-through;
        }
    }
    &.checklist-item--selected {
        border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
        border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    // Hide these until row is hovered
    .checklist-drag, .checklist-btn {
        opacity: 0;
        transition: opacity 0.2s;
    }
    &:hover {
        .checklist-drag, .checklist-btn {
            opacity: 1;
        }
    }

    .checklist-drag {
        height: $checklist-item-height !important;
        cursor: move;
    }

    .checklist-checkbox {
        flex: initial !important;
        margin-left: -8px;
        height: $checklist-item-height !important;
    }

    .checklist-input {
        flex: 1 1 0;
        resize: none;
        box-sizing: border-box;
        min-height: $checklist-item-height !important;
        padding: 3px 4px;
        background-color: rgba(var(--v-theme-on-surface), 0);
        color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
        transition: background-color 0.2s;

        &:focus {
            outline: none;
            background-color: rgba(var(--v-theme-on-surface), var(--v-focus-opacity));
        }
    }
    .checklist-btn {
        height: calc($checklist-item-height - 2px) !important;
    }
}
</style>