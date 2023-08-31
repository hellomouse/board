<!--
Example usage:

<pin-checklist-pin
    v-model:content="content"
/>
-->

<template>
    <div class="container">
        <div class="scroll">
            <pin-checklist
                :key="checklistKey"
                v-model="checklist"
                @deleteElement="e => checklist = checklist.filter(i => i !== e)"
                @pushHistory="updateHistory()"
            />
        </div>
        <br>

        <div class="d-flex">
            <v-tooltip text="Undo (Ctrl+Z)" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        icon="mdi-undo" v-bind="props" flat color="transparent"
                        @click="undo" />
                </template>
            </v-tooltip>

            <v-tooltip text="Redo (Ctrl+Y)" location="bottom">
                <template #activator="{ props }">
                    <v-btn
                        icon="mdi-redo" v-bind="props" flat color="transparent"
                        @click="redo" />
                </template>
            </v-tooltip>

            <v-spacer />
            <v-btn
                prepend-icon="mdi-plus" flat color="transparent"
                :disabled="checklist.length >= MAX_CHECKBOXES"
                @click="addItem"
            >
                Add item
            </v-btn>
            <v-btn prepend-icon="mdi-sort-bool-ascending-variant" flat color="transparent" @click="sortCompleted">Group completed</v-btn>
        </div>

        <span v-if="checklist.length >= MAX_CHECKBOXES" class="text-red">You have too many checkboxes</span>

        <!-- Helpful history visualization:
        <pre>{{ history.map((x, i) => x.map(y => y.value) + " " + (historyPointer === i ? ' <' : '')) }}</pre> -->
    </div>
</template>

<script>
import { contentToChecklist, checklistToContent } from '~/helpers/board/pin-checklist.js';

const MAX_CHECKBOXES = 150;
const UNDO_HISTORY = 20;

export default {
    props: {
        content: {
            required: true,
            type: String
        }
    },
    data() {
        let list = contentToChecklist(this.content) || [{ selected: false, value: '', id: 1 }];
        this.$emit('update:content', checklistToContent(list));
        return {
            checklist: list,
            canDrag: false,
            MAX_CHECKBOXES,
            history: [list.map(x => Object.assign({}, x))],
            historyPointer: -1,
            checklistKey: Math.random()
        };
    },
    watch: {
        checklist() {
            this.updateHistory();
        }
    },
    mounted() {
        if (process.client)
            document.addEventListener('keyup', this.keyupHandler)
    },
    destroyed() {
        if (process.client)
            document.removeEventListener('keyup', this.keyupHandler)
    },
    methods: {
        addItem() {
            if (this.checklist.length >= MAX_CHECKBOXES)
                return;
            this.checklist.push({
                checked: false,
                value: '',
                id: Math.random()
            });
            this.updateHistory();
        },
        sortCompleted() {
            this.checklist.sort((a, b) => {
                if (a.checked === b.checked) return 0;
                return a.checked ? 1 : -1;
            });
            this.updateHistory();
        },
        undo() {
            if (this.historyPointer < 0)
                this.historyPointer = this.history.length - 1;
            this.historyPointer--;
            if (this.historyPointer < 0 || this.historyPointer >= this.history.length)
                return;
            this.setNewHistoryState();
        },
        redo() {
            if (this.historyPointer >= this.history.length - 1)
                return;
            if (this.historyPointer < 0)
                this.historyPointer = -1;
            this.historyPointer++;
            if (this.historyPointer < 0 || this.historyPointer >= this.history.length)
                return;
            this.setNewHistoryState();
        },
        setNewHistoryState() {
            let copy = this.history[this.historyPointer].map(x => { return {...x}});
            copy.forEach(x => delete x.selected);
            copy.doNotAddToHistory = true;
            this.checklist = copy;
            this.checklistKey = Math.random();
        },
        keyupHandler(event) {
            if (event.ctrlKey && event.key === 'z')
                this.undo();
            else if (event.ctrlKey && event.key === 'y')
                this.redo();
        },
        updateHistory() {
            this.$emit('update:content', checklistToContent(this.checklist));

            if (this.checklist.doNotAddToHistory) {
                this.checklist.doNotAddToHistory = false;
                return;
            }
            if (this.historyPointer >= 0) {
                this.history = this.history.slice(0, this.historyPointer + 1);
                this.historyPointer++;
            }
            this.history.push(this.checklist.map(x => { return { ...x } }));
            if (this.history.length > UNDO_HISTORY)
                this.history = this.history.slice(1);
        }
    },

}
</script>

<style lang="scss" scoped>
.scroll {
    max-height: 320px;
    overflow-y: auto;
}

.container {
    padding: 10px 0;
    margin-top: -10px;
    margin-bottom: 10px;

    background-size: cover !important;
    background-position: center !important;
}
</style>