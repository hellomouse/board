<template>
    <v-sheet
        elevation="0"
        min-width="250"
        max-height="600"
        class="pin-tile"
        :color="color"
        :class="pinTileClasses"

        @click="clickHandler"
    >
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
                    :key="icon"
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
            <span v-html="content"></span>
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
                        :color="color"
                        flat
                    ></v-btn>
                </template>
                
                <v-sheet elevation="8" rounded="0">
                    <button class="px-4 hoverable hover-list-item edit-list-item" @click="copyPermaLink">
                        <v-icon icon="mdi-link" />Permalink
                    </button>
                    <button
                        v-if="viewerHasPerm"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        :disabled="locked"
                        @click="emitEditUpdate()"
                    >
                        <v-icon icon="mdi-pencil" />Edit
                    </button>
                    <button
                        class="px-4 hoverable hover-list-item edit-list-item line"
                    >
                        <v-icon icon="mdi-star" />Favorite
                    </button>

                    <button
                        v-if="viewerHasPerm"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('PINNED')"
                    >
                        <v-icon :icon="pinned ? 'mdi-pin-off' : 'mdi-pin'" />
                        {{ pinned ? 'Unpin' : 'Pin' }}
                    </button>
                    <button
                        v-if="viewerHasPerm"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('LOCKED')"
                    >
                        <v-icon :icon="locked ? 'mdi-lock-open' : 'mdi-lock'" />
                        {{ locked ? 'Unlock' : 'Lock' }}
                    </button>
                    <button
                        v-if="viewerHasPerm"
                        class="px-4 hoverable hover-list-item edit-list-item"
                        @click="toggleFlag('ARCHIVED')"
                    >
                        <v-icon :icon="archived ? 'mdi-folder-off' : 'mdi-folder-zip'" />
                        {{ archived ? 'Unarchive' : 'Archive' }}
                    </button>
                    <button
                        v-if="viewerHasPerm"
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
        pinId: { type: String, default: '' },
        metadata: { type: Object, default: () => {} },
        attachmentPaths: { type: Array, default: () => [] },
        color: { type: String, default: '' },
        perm: { type: String, default: '' },
        alwaysShowDetails: { type: Boolean, default: false }
    },
    data() {
        return {
            // Deleting
            deleting: false, // In process of deleting?
            deletionTimeout: null,
            flags: this.initialFlags,

            // Click
            numClicks: 0
        };
    },
    computed: {
        pinTileClasses() {
            let flagsArr = this.flags.toUpperCase().split(' | ');
            let classes = [];
            if (flagsArr.includes('ARCHIVED'))
                classes.push('archived');
            if (flagsArr.includes('PINNED'))
                classes.push('pinned');
            if (this.alwaysShowDetails)
                classes.push('pin-tile--always-show-details');
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
        viewerHasPerm() {
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
    methods: {
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

            try {
                await this.$fetchApi('/api/board/pins', 'PUT', { id: this.pinId, flags: this.flags });
            } catch (e) {
                let errorMsg = `Failed to update pin: ${this.$apiErrorToString(e)}`;
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
        clickHandler() {
            this.numClicks++;
            if (this.numClicks === 1) {
                let self = this;
                setTimeout(() => {
                    if (self.numClicks >= 3 && !this.locked)
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
    }
}
</script>

<style lang="scss">
@import "~/assets/variables.scss";
@import "~/assets/css/dropdown-menu.scss";

.pin-tile {
    page-break-inside: avoid;
    break-inside: avoid-column;
    display: table;

    overflow: auto;
    position: relative;

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
        opacity: 0.9; // Temporary TODO
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