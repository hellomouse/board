<template>
    <v-sheet
        elevation="0"
        min-width="250"
        max-height="500"
        class="pin-tile"
        :color="color"
        :class="pinTileClasses"
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
            
        <div class="px-4 py-1 pin-tile__content">
            <span v-html="content"></span>
        </div>

        <div class="pl-4 pin-tile__bottom">
            <div class="pin-tile__timestamp-wrapper">
                <div v-if="created" class="pin-tile__timestamp">
                    <v-icon icon="mdi-clock"/> {{ created }}
                </div>
                <div v-if="edited" class="pin-tile__timestamp">
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
                    <button class="px-4 hoverable hover-list-item edit-list-item">
                        <v-icon icon="mdi-link" />Permalink
                    </button>
                    <button class="px-4 hoverable hover-list-item edit-list-item">
                        <v-icon icon="mdi-pencil" />Edit
                    </button>
                    <button class="px-4 hoverable hover-list-item edit-list-item line">
                        <v-icon icon="mdi-star" />Favorite
                    </button>

                    <button class="px-4 hoverable hover-list-item edit-list-item">
                        <v-icon icon="mdi-pin" />Pin
                    </button>
                    <button class="px-4 hoverable hover-list-item edit-list-item">
                        <v-icon icon="mdi-lock" />Lock
                    </button>
                    <button class="px-4 hoverable hover-list-item edit-list-item">
                        <v-icon icon="mdi-folder-zip" />Archive
                    </button>
                    <button
                        class="px-4 text-red [ hoverable hover-list-item ] edit-list-item"
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
        flags: { type: String, default: '' },
        pinId: { type: String, default: '' },
        metadata: { type: Object, default: () => {} },
        attachmentPaths: { type: Array, default: () => [] },
        color: { type: String, default: '' }
    },
    data() {
        return {
            // Deleting
            deleting: false, // In process of deleting?
            deletionTimeout: null,
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
            return classes;
        },
        flag_icons() {
            let flagsArr = this.flags.toUpperCase().split(' | ');
            let flags = [];

            if (flagsArr.includes('ARCHIVED')) {
                flags.push({
                    icon: 'mdi-folder-zip',
                    text: 'Archived'
                });
            }
            if (flagsArr.includes('LOCKED')) {
                flags.push({
                    icon: 'mdi-lock',
                    text: 'Locked'
                });
            }
            if (flagsArr.includes('PINNED')) {
                flags.push({
                    icon: 'mdi-pin',
                    text: 'Pinned'
                });
            }
            return flags;
        }
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
        }
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

    overflow: hidden;
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
        opacity: 0;
        transition: opacity 0.2s;
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