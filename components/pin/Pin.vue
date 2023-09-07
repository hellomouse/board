<template>
    <v-sheet
        elevation="0"
        min-width="250"
        max-height="600"
        class="pin-tile"
        :style="{ background: background }"
        :class="pinTileClasses"

        @click="clickHandler"
    >
        <div class="toggle" @click="onSelect" />

        <div v-if="deleting" class="delete-confirmation-overlay">
            <div class="delete-confirmation-overlay__center">
                Deleting Pin...<br>

                <v-progress-linear color="primary" indeterminate class="mb-4" />

                <v-btn color="primary" @click="cancelDeletePin()">Cancel</v-btn>
            </div>
        </div>

        <div class="pin-tile__header pt-4 px-4">
            <div class="pin-tile__header__creator-wrapper text-truncate">
                <profile-picture class="mr-1 d-inline-block" style="vertical-align: middle" size="12pt" src="" />
                <span class="pin-tile__header__creator">@{{ creator }}</span>
            </div>

            <div class="pin-tile__header__icon-row">
                <v-tooltip
                    v-for="icon in flag_icons"
                    :key="pinId + icon"
                    :text="icon.text"
                    location="top"
                >
                    <template #activator="{ props }">
                        <v-icon
                            v-bind="props"
                            class="pa-2 ml-2"
                        >
                            {{ icon.icon }}
                        </v-icon>
                    </template>
                </v-tooltip>
            </div>
        </div>

        <div class="px-4 py-1 pin-tile__content" style="max-height: 500px; overflow-y: auto">
            <!-- Markdown -->
            <span v-if="type === 'Markdown'" v-html="content"></span>

            <!-- Link pin -->
            <pin-link
                v-if="type === 'Link'"
                :content="content"
            />

            <!-- Checklist pin -->
            <pin-checklist
                v-if="type === 'Checklist'"
                :simple="true" :locked="locked"
                :checklist="contentToChecklist(content) || []"
                @check="v => resendContent(pinId, checklistToContent(v))"
            />
        </div>

        <div class="pl-4 pin-tile__bottom">
            <div class="pin-tile__timestamp-wrapper">
                <div v-if="created" class="pin-tile__timestamp truncate-text">
                    <v-icon icon="mdi-clock"/> {{ created }}
                </div>
                <div v-if="edited && edited !== created" class="pin-tile__timestamp truncate-text">
                    &nbsp; | &nbsp;<v-icon icon="mdi-pencil"/> {{ edited }}
                </div>
            </div>

            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        density="comfortable"
                        icon="mdi-dots-vertical"
                        v-bind="props"
                        :color="'transparent'"
                        flat
                    ></v-btn>
                </template>
                
                <v-sheet elevation="8" rounded="0">
                    <button class="px-4 hoverable hover-list-item edit-list-item" @click="copyPermaLink">
                        <v-icon icon="mdi-link" />Permalink
                    </button>
                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        :disabled="locked"
                        @click="emitEditUpdate()"
                    >
                        <v-icon icon="mdi-pencil" />Edit
                    </button>
                    <button
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="emitCopyToBoardUpdate()"
                    >
                        <v-icon icon="mdi-content-copy" />Copy to Board
                    </button>
                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        :disabled="locked"
                        @click="emitHistoryUpdate()"
                    >
                        <v-icon icon="mdi-clock" />History
                    </button>
                    <button
                        class="px-4 hoverable hover-list-item edit-list-item edit-list-item--line"
                        @click="toggleFavorite()"
                    >
                        <v-icon :icon="favorited ? 'mdi-star-off' : 'mdi-star'" />
                        {{ favorited ? 'Unfavorite' : 'Favorite' }}
                    </button>

                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('PINNED')"
                    >
                        <v-icon :icon="pinned ? 'mdi-pin-off' : 'mdi-pin'" />
                        {{ pinned ? 'Unpin' : 'Pin' }}
                    </button>
                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('LOCKED')"
                    >
                        <v-icon :icon="locked ? 'mdi-lock-open' : 'mdi-lock'" />
                        {{ locked ? 'Unlock' : 'Lock' }}
                    </button>
                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('ARCHIVED')"
                    >
                        <v-icon :icon="archived ? 'mdi-folder-off' : 'mdi-folder-zip'" />
                        {{ archived ? 'Unarchive' : 'Archive' }}
                    </button>
                    <button
                        v-if="userHasPermToEdit"
                        class="px-4 text-red [ hoverable hover-list-item ] edit-list-item edit-list-item--line"
                        @click="deletePin()"
                    >
                        <v-icon icon="mdi-trash-can" color="red" />Delete
                    </button>
                </v-sheet>
            </v-menu>
        </div>
    </v-sheet>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { getBackground, getColor } from '~/helpers/board/pin-colors.js';
import { useOptionStore } from '~/store/optionStore.js';
import { contentToChecklist, checklistToContent } from '~/helpers/board/pin-checklist.js';

const RESEND_CONTENT_INTERVAL = 500;

export default {
    name: 'BoardPin',
    props: {
        content: { type: String, default: '' },
        type: { type: String, default: '' },
        creator: {
            type: String,
            default: 'unknown user'
        },
        created: { type: String, default: '' },
        edited: { type: String, default: '' },
        initialFlags: { type: String, default: '' },
        initialSelected: { type: Boolean, default: false },
        pinId: { type: String, default: '' },
        boardId: { type: String, default: '' },
        metadata: { type: Object, default: () => {} },
        attachmentPaths: { type: Array, default: () => [] },
        color: { type: String, default: '' },
        perm: { type: String, default: '' },
        alwaysShowDetails: { type: Boolean, default: false },
        initialFavorited: { type: Boolean, default: false },

        deselectTrigger: { type: Boolean, default: false },
        selectTrigger: { type: Boolean, default: false }
    },
    data() {
        return {
            // Deleting
            deleting: false, // In process of deleting?
            deletionTimeout: null,
            flags: this.initialFlags,
            favorited: this.initialFavorited,

            // Click
            numClicks: 0,
            selected: this.initialSelected,

            // Misc
            resendContentTimeout: null,
            resendContentLast: 0
        };
    },
    computed: {
        background() {
            let color = getColor(this.color, !useOptionStore(this.$pinia).dark_theme);
            return getBackground(color);
        },
        pinTileClasses() {
            let flagsArr = this.flags.toUpperCase().split(' | ');
            let classes = [];
            if (flagsArr.includes('ARCHIVED'))
                classes.push('archived');
            if (flagsArr.includes('PINNED'))
                classes.push('pinned');
            if (this.alwaysShowDetails)
                classes.push('pin-tile--always-show-details');
            if (this.selected)
                classes.push('pin-tile--selected');
            return classes;
        },
        flag_icons() {
            let flags = [];

            if (this.archived) {
                flags.push({
                    icon: 'mdi-folder-zip',
                    text: 'Archived'
                });
            }
            if (this.locked) {
                flags.push({
                    icon: 'mdi-lock',
                    text: 'Locked'
                });
            }
            if (this.pinned) {
                flags.push({
                    icon: 'mdi-pin',
                    text: 'Pinned'
                });
            }
            return flags;
        },
        userHasPermToEdit() {
            if (!['Owner', 'Edit', 'SelfEdit'].includes(this.perm))
                return false;
            if (this.perm === 'SelfEdit')
                return this.creator === useAuthStore(this.$pinia).user.id;
            return true;
        },

        locked() { return this.flags.split(' | ').includes('LOCKED'); },
        pinned() { return this.flags.split(' | ').includes('PINNED'); },
        archived() { return this.flags.split(' | ').includes('ARCHIVED'); }
    },
    watch: {
        deselectTrigger() { this.selected = false; },
        selectTrigger() { this.selected = true; },

        // Property updates
        initialFlags() { this.flags = this.initialFlags; },
        initialFavorited() { this.favorited = this.initialFavorited; }
    },
    methods: {
        contentToChecklist,
        checklistToContent,
        deletePin() {
            this.deleting = true;
            this.deletionTimeout = setTimeout(async () => {
                if (!this.deleting) return; // Cancelled
                try {
                    await this.$fetchApi('/api/board/pins', 'DELETE', { id: this.pinId });
                    this.$emit('update', { type: 'pin_delete' });
                } catch (e) {
                    let errorMsg = `Failed to delete pin: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }
                this.deleting = false;
            }, 3000);
        },
        cancelDeletePin() {
            this.deleting = false;
            clearTimeout(this.deletionTimeout);
        },
        async toggleFlag(flag) {
            let newFlags = this.flags.split(' | ');
            newFlags = newFlags.includes(flag) ?
                newFlags.filter(f => f !== flag) :
                newFlags.concat([flag]).filter(x => x);
            this.flags = newFlags.join(' | ');
            this.$emit('flagsUpdate', {
                id: this.pinId,
                flags: this.flags
            });

            try {
                await this.$fetchApi('/api/board/pins', 'PUT', { id: this.pinId, flags: this.flags });
            } catch (e) {
                let errorMsg = `Failed to update pin: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
        },
        async toggleFavorite() {
            try {
                await this.$fetchApi('/api/board/pins/favorites', this.favorited ? 'DELETE' : 'PUT', { pin_ids: [this.pinId] });
                this.favorited = !this.favorited;
                this.$emit('success', (this.favorited ? 'Added' : 'Removed') + ' favorite');
                this.$emit('update', {
                    type: 'pin-favorite',
                    id: this.pinId,
                    favorited: this.favorited
                });
            } catch (e) {
                let errorMsg = `Failed to favorite pin: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
        },
        emitEditUpdate() {
            this.$emit('update', {
                type: 'pin-edit',
                pin: {
                    pin_id: this.pinId,
                    board_id: this.boardId,
                    type: this.type,
                    creator: this.creator,
                    edited: this.edited,
                    content: this.content,
                    attachment_paths: this.attachmentPaths,
                    metadata: this.metadata
                }
            });
        },
        emitHistoryUpdate() {
            this.$emit('update', {
                type: 'pin-history',
                pin: this.getPinForHistoryAndCopy()
            });
        },
        emitCopyToBoardUpdate() {
            this.$emit('update', {
                type: 'pin-copy-to-board',
                pin: this.getPinForHistoryAndCopy()
            });
        },
        getPinForHistoryAndCopy() {
            return {
                pin_id: this.pinId,
                type: this.type,
                content: this.content,
                attachment_paths: this.attachmentPaths,
                metadata: this.metadata,
                flags: this.flags
            };
        },
        clickHandler() {
            this.numClicks++;
            if (this.numClicks === 1) {
                let self = this;
                setTimeout(() => {
                    if (self.numClicks >= 3 && !this.locked && this.userHasPermToEdit)
                        this.emitEditUpdate();
                    self.numClicks = 0;
                }, 300);
            }
        },
        copyPermaLink() {
            if (process.client)
                navigator.clipboard.writeText(window.location.origin + '/board/board?pin_id=' + this.pinId);
            this.$emit('success', 'Link copied!');
        },
        onSelect() {
            this.selected = !this.selected;
            this.$emit('select', {
                id: this.pinId,
                selected: this.selected
            });
        },
        async resendContent(pinId, content) {
            // If no edit perm ignore
            if (!this.userHasPermToEdit) return;

            let sendContent = async () => {
                this.resendContentLast = Date.now();
                this.resendContentTimeout = null;
                try {
                    await this.$fetchApi('/api/board/pins', 'PUT', { id: this.pinId, content });
                    this.$emit('update', {
                        type: 'content',
                        id: this.pinId,
                        content
                    });
                } catch (e) {
                    let errorMsg = `Failed to update pin: ${this.$apiErrorToString(e)}`;
                    this.$emit('error', errorMsg);
                }
            };

            let diff = Date.now() - this.resendContentLast;
            if (diff > RESEND_CONTENT_INTERVAL)
                sendContent();
            else {
                clearTimeout(this.resendContentTimeout);
                this.resendContentTimeout = null;
                this.resendContentTimeout = setTimeout(sendContent, Math.max(1, RESEND_CONTENT_INTERVAL - diff));
            }
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/variables.scss";
@import "~/assets/css/dropdown-menu.scss";

.v-theme--light {
    .pin-tile.pin-tile--selected {
        border: 1px solid black !important;
    }
}

.pin-tile {
    page-break-inside: avoid;
    break-inside: avoid-column;
    display: table;

    overflow: auto;
    overflow-x: hidden;
    position: relative;
    border: 1px solid transparent;
    transition: border 0.2s;
    
    background-position: center !important;
    background-size: cover !important;

    &.pin-tile--selected {
        border: 1px solid white !important;
        .toggle { opacity: 1; }
    }

    .toggle {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;

        opacity: 0;
        transition: opacity 0.2s;
        cursor: pointer;
        background: linear-gradient(to right bottom, white 50%, rgba(0, 0, 0, 0) 50.3%);
    }

    &:hover .toggle {
        opacity: 1;
    }

    // Text alignment:
    .ql-align-justify { text-align: justify; }
    .ql-align-right { text-align: right; }
    .ql-align-center { text-align: center; }

    // Limit image size
    img {
        max-width: 100%;
    }

    // Left margin for lists
    ul, ol {
        margin-left: 16px;
    }

    // Faded ver. for archived posts
    &.archived:after {
        position: absolute;
        height: 100%;
        width: 100%;
        display: block;
        z-index: 1;
        top: 0;

        background: rgba(0, 0, 0, 0.4);
        content: "";
        pointer-events: none;
    }

    &.pinned {
        border: 1px solid rgb(var(--v-theme-primary));
    }


    // Hide details until hover
    &__header__icon-row,
    &__timestamp-wrapper {
        
        transition: opacity 0.2s;
        overflow-x: auto;
        display: flex;
    }

    &:not(.pin-tile--always-show-details) &__header__icon-row,
    &:not(.pin-tile--always-show-details) &__timestamp-wrapper{
        opacity: 0;
    }

    &:hover &__header__icon-row,
    &:hover &__timestamp-wrapper {
        opacity: 1;
        transition: opacity 0.2s;
    }

    &__header {
        &__creator-wrapper {
            max-width: 70%;
            display: inline-block;
        }

        &__creator {
            opacity: $secondary-text-opacity
        }
        
        &__icon-row {
            float: right;
        }
    }

    &__content {
        // Thin scrollbars
        scrollbar-width: thin;
        &::-webkit-scrollbar {
            width: 2px !important;
        }

        opacity: 0.9;
    }

    &__bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 37px; // 1 higher than button to avoid weird button offset

        .pin-tile__timestamp {
            display: inline-block;
            font-size: 0.75rem;
            opacity: $secondary-text-opacity;
        }

        .v-btn {
            position: relative;
            margin-left: auto;
        }
    }
}
</style>

<style lang="scss" scoped>
.delete-confirmation-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;

    &__center {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        text-align: center;
    }
}
</style>