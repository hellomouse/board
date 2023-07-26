<template>
    <v-sheet
        elevation="0"
        min-width="250"
        max-height="500"
        class="pin-tile"
    >
        <div class="pin-tile__header pt-4 px-4">
            <div class="pin-tile__header__creator text-truncate">
                @{{ creator }}
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
            
        <div class="pa-4 pin-tile__content">
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

            <div v-if="created" class="pin-tile__timestamp">
                <v-icon icon="mdi-clock"/> {{ created }}
            </div>
            <div v-if="edited" class="pin-tile__timestamp">
                &nbsp; | &nbsp;<v-icon icon="mdi-pencil"/> {{ edited }}
            </div>

            <v-btn
                density="comfortable"
                icon="mdi-dots-vertical"
                flat
            ></v-btn>
        </div>
    
        <!-- Icon button dropdown,  pfp -->
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
        flag_icons() {
            // TODO: get flags from provided flags
            return [{
                icon: 'mdi-lock',
                text: 'Locked'
            }, {
                icon: 'mdi-pin',
                text: 'Pinned'
            }, {
                icon: 'mdi-folder-zip',
                text: 'Archived'
            }];
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.pin-tile {
    display: inline-block;
    overflow: hidden;

    .pin-tile__header {
        .pin-tile__header__creator {
            max-width: 70%;
            display: inline-block;
            font-weight: bold;
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
