<template>
    <v-sheet
        elevation="0"
        class="board-tile hoverable mr-3 mb-3"
        :style="{ borderColor: color }"
    >
        <div class="px-4 pt-4">
            <div class="text-truncate text-h6">{{ title }}</div>
        </div>
        
        <div class="px-4 pb-3">
            <div class="board-tile__desc text-truncate">{{ desc }}</div>
            <div class="board-tile__owner-row pt-1 mt-1">
                <div class="board-tile__pfp mr-1"></div>
                <div class="d-inline-block text-truncate">
                    <small>@{{ creatorId }}</small>
                </div>
            </div>
        </div>

        <!-- TODO: share, edit, created date -->
    </v-sheet>
</template>

<script>
export default {
    name: 'BoardBoard',
    props: {
        title: {
            type: String,
            default: 'No title provided'
        },
        desc: {
            type: String,
            default: 'No desc provided'
        },
        creatorId: {
            type: String,
            default: 'Unknown creator'
        },
        color: {
            type: String,
            default: "#FFFFFF",
            validator(value) { return /^#[0-9a-fA-F]{6}$/i.test(value); }
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.board-tile {
    max-width: 100%;
    width: 320px;
    border-right: 3px solid;
    display: inline-block;

    .board-tile__owner-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 1px solid $border-color;
    }

    .board-tile__desc {
        opacity: $secondary-text-opacity;
    }

    .board-tile__pfp {
        width: 12pt;
        height: 12pt;
        vertical-align: middle;
        border-radius: 50%;
        background: white;
        display: inline-block;
    }
}
</style>
