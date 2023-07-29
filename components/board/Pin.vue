<template>
    <v-sheet
        elevation="0"
        min-width="250"
        max-height="500"
        class="pin-tile"
        :class="pinTileClasses"
    >
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
            This is a pin

            type: string,
            content: string HTML content,
            creator: (owner info as in GET /users),
            created: Created timestamp (UNIX time),
            edited:  Edited timestamp (UNIX time),
            flags: “FLAG1 | FLAG2…”,
            metadata: JSON of metadata
            attachment_paths
            pin_id
            pin_type
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
                    <button class="px-4 text-red [ hoverable hover-list-item ] edit-list-item">
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
        id: { type: String, default: '' },
        metadata: { type: Object, default: () => {} },
        attachmentPaths: { type: Array, default: () => [] }
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
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/dropdown-menu.scss";

.pin-tile {
    display: inline-block;
    overflow: hidden;
    position: relative;

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
    .pin-tile__header__icon-row,
    .pin-tile__timestamp-wrapper {
        opacity: 0;
        transition: opacity 0.2s;
    }

    &:hover {
        .pin-tile__header__icon-row,
        .pin-tile__timestamp-wrapper {
            opacity: 1;
            transition: opacity 0.2s;
        }
    }

    .pin-tile__header {
        .pin-tile__header__creator-wrapper {
            max-width: 70%;
            display: inline-block;
        }

        .pin-tile__header__creator {
            opacity: $secondary-text-opacity
        }
        
        .pin-tile__header__icon-row {
            float: right;
        }
    }

    .pin-tile__content {
        opacity: 0.9; // Temporary TODO
    }

    .pin-tile__bottom {
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
