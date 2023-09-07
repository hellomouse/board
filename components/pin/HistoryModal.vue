
<template>
    <v-dialog
        v-model="showModal"
        width="920"
    >
        <v-card rounded="0" width="1020" class="py-1">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">Pin History</h1>

                <div v-if="history.length > 0">
                    <div class="d-flex">
                        <div class="d-flex" style="width: 100%">
                            <div style="width: 50%" class="history-title pl-1">+R{{ revisionTitle[0] || '?' }} / Additions</div>
                            <div style="width: 50%" class="history-title">-R{{ revisionTitle[1] || '?' }} / Removals</div>
                        </div>
                        <div style="width: 300px" class="history-title">Revisions</div>
                    </div>

                    <div class="d-flex">
                        <code-diff style="width: 100%; height: 300px" :old-string="oldHtml" :new-string="newHtml" />

                        <v-list class="history-list pa-0">
                            <v-list-item
                                v-for="(item, index) in history"
                                :key="item.time"
                                class="history-list__item"
                                :title="'@' + item.editor"
                                :subtitle="`R${item.id} &nbsp; ` + $formatTimestamp(item.time)"
                                @click="switchHistory(index)"
                            ></v-list-item>
                        </v-list>
                    </div>
                </div>
    
                <!-- Empty state -->
                <div v-if="history.length === 0" class="empty-state-container">
                    <img src="/error-state.png" alt="Empty state" />
                    <h2>There is no history for this pin yet</h2>
                </div>


                <div class="d-flex mt-2">
                    <v-dialog v-model="confirmationModal" width="auto">
                        <template #activator="{ props }">
                            <v-btn
                                v-if="history.length > 0"
                                flat color="primary" variant="text"
                                :text="`Revert to this revision (R${revisionTitle[0]})`"
                                @click="confirmationModal = true"
                            />
                        </template>

                        <v-card rounded="0">
                            <v-card-text>
                                Are you sure you want to revert to revision R{{ revisionTitle[0] || 'X' }}?
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="primary" @click="confirmationModal = false">Cancel</v-btn>
                                <v-btn color="primary" @click="restoreCurrentRevision">Revert</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-spacer />
                    <v-btn variant="text" color="primary" @click="$emit('update', { type: 'close' })">OK</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { escapeHtml } from '~/helpers/format.js';

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        pin: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showModal: this.show,
            confirmationModal: false,
            oldHtml: '',
            newHtml: '',
            history: [],
            revisionTitle: ['', ''],
            currentRevision: 0,
            historyCache: {} // id -> obj
        };
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
            if (newVal) this.loadHistoryPreview();
        }
    },
    async created() {
        this.loadHistoryPreview();
    },
    methods: {
        formatContent(content, pinType) {
            if (pinType === 'Markdown')
                return content;
            else if (pinType === 'Checklist') {
                return escapeHtml(
                    content.split('\n').map(l => (l[0] === '1' ? '[x]' : '[ ]') + ' ' + l.substring(1)).join('\n'));
            }
            return escapeHtml(content);
        },
        // Convert pin content to HTML for passing
        getHTML(history) {
            if (!history) return 'There is no history for this revision';
            return '<b>Content:</b>\n' 
                + this.formatContent(history.content, this.pin.type)
                + '\n\n<b>Attachments</b>\n'
                + escapeHtml(history.attachment_paths.join('\n') || 'None')
                + '\n\n<b>Flags:</b>\n'
                + escapeHtml(history.flags || 'None')
                + '\n\n<b>Metadata</b>\n'
                + escapeHtml(JSON.stringify(history.metadata));
        },
        // Get a single history revision
        async getHistory(id) {
            if (!id) return null;
            if (this.historyCache[id]) return this.historyCache[id];

            let result = null;
            try {
                let his = await this.$fetchApi('/api/board/pins/history', 'GET', { pin_id: this.pin.pin_id, history_id: id });
                if (!his.history) throw new Error('Failed to get history by id');
                result = his.history;
            } catch (e) {
                let errorMsg = `Failed to get history diff: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.historyCache[id] = result;
            return result;
        },
        // Switch to history item
        async switchHistory(index) {
            this.currentRevision = index;

            const id1 = (this.history[index] || {}).id;
            const id2 = (this.history[index + 1] || {}).id;
            this.revisionTitle = [id1, id2];

            let oldHistory = await this.getHistory(id1);
            let newHistory = await this.getHistory(id2);

            this.newHtml = this.getHTML(newHistory);
            this.oldHtml = this.getHTML(oldHistory);
        },
        // Edit pin content to be current revision
        async restoreCurrentRevision() {
            let history = this.historyCache[this.history[this.currentRevision].id];
            if (!history) {
                this.$emit('error', 'Failed to locate revision, try again later'); 
                this.confirmationModal = false;
                return;
            }

            // Attempt edit
            try {
                let params = {
                    board_id: this.pin.board_id,
                    id: this.pin.pin_id,
                    flags: history.flags,
                    content: history.content,
                    attachment_paths: history.attachment_paths,
                    metadata: history.metadata
                };
                await this.$fetchApi('/api/board/pins', 'PUT', params);
                this.$emit('success', 'Revision restored');
                this.$emit('update', {
                    type: 'pin-content',
                    id: this.pin.pin_id,
                    history
                });
            } catch (e) {
                let errorMsg = `Failed to modify pin: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.confirmationModal = false;
        },
        // Load history preview
        async loadHistoryPreview() {
            try {
                let his = await this.$fetchApi('/api/board/pins/history/preview', 'GET', { pin_id: this.pin.pin_id });
                this.history = his.history;
            } catch (e) {
                let errorMsg = `Failed to get history: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            await this.switchHistory(0);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/modal-empty-state.scss";

.history-list {
    width: 300px;
    height: 300px;

    .history-list__item {
        background-color: rgb(var(--v-theme-on-surface), var(--v-hover-opacity));
    }
}

.history-title {
    padding: 4px 16px;
    color: rgb(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    background: rgb(var(--v-theme-background), 0.4);
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>