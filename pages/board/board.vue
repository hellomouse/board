<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
});
</script>

<template>
    <!-- A page to show pins within a single board -->
    <div>
        <NuxtLayout name="board">
            <BoardLeftNav>
                <v-btn
                    color="green" block
                    height="44"
                >
                    <v-icon icon="mdi-plus" /> New Pin
                </v-btn>
            </BoardLeftNav>

            <v-container class="container pt-0" :style="{ borderRight: `4px solid ${boardColor}` }">

                <!-- TODO: full board name  + desc -->
                <h1>
                    <v-menu>
                        <template #activator="{ props }">
                            <v-btn
                                density="comfortable"
                                icon="mdi-dots-vertical"
                                v-bind="props"
                                class="board-tile__menu d-inline-block"
                                flat color="transparent"
                            ></v-btn>
                        </template>
                
                        <v-sheet elevation="8" rounded="0">
                            <button class="px-4 hoverable hover-list-item edit-list-item" @click="copyShareLink">
                                <v-icon icon="mdi-link" />Permalink
                            </button>
                            <button
                                class="px-4 [ hoverable hover-list-item ] [ edit-list-item ]"
                            >
                                <v-icon icon="mdi-information-outline" />Properties
                            </button>
                            <button
                                v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                                class="px-4 hoverable hover-list-item edit-list-item"
                            >
                                <v-icon icon="mdi-account-plus" />Share
                            </button>
                            <button
                                v-if="['Owner', 'Edit'].includes(currentUserPerm)"
                                class="px-4 hoverable hover-list-item edit-list-item"
                            >
                                <v-icon icon="mdi-pencil" />Edit
                            </button>
                            <button
                                v-if="['Owner'].includes(currentUserPerm)"
                                class="px-4 text-red [ hoverable hover-list-item ] [ edit-list-item edit-list-item--line ]"
                            >
                                <v-icon icon="mdi-trash-can" color="red" />Delete
                            </button>
                        </v-sheet>
                    </v-menu>

                    {{ boardTitle }}
                </h1>

                <p class="ml-11 subtitle">{{ boardDesc }}</p>


                <!-- Sort options -->
                <div class="[ small-container ] mb-2 d-flex flex-direction-row justify-end">
                    <v-select
                        v-model="selected" density="compact" solo-filled max-width="200"
                        flat class="select mr-2"
                        :items="['Created', 'Modified']"
                    ></v-select>

                    <v-btn
                        icon variant="text"
                        height="40"
                        @click="toggleSortDirection"
                    >
                        <v-icon class="sort-arrow-down" :class="downArrowClass">mdi-arrow-up</v-icon>
                    </v-btn>

                    <v-menu :close-on-content-click="false">
                        <template #activator="{ props }">
                            <v-btn
                                icon variant="text"
                                height="40"
                                v-bind="props"
                            >
                                <v-icon>mdi-cog</v-icon>
                            </v-btn>
                        </template>
                        <v-sheet color="background-light" elevation="8" rounded="0" class="px-4 py-1">
                            <v-switch v-model="alwaysShowCardDetails" color="red" label="Always show pin details"></v-switch>
                        </v-sheet>
                    </v-menu>
                </div>

                <div class="grid">
                    <BoardPin
                        v-for="index in 10" :key="index" 
                        creator="helloasdad1231521613123131312313131231313212312313131312"
                        created="1:00 AM 12/12/12"
                        edited="1:00 AM 12/12/12"
                        flags="LOCKED"
                        class="mb-1"
                    />
                </div>
            </v-container>
        </NuxtLayout>
    </div>
</template>

<script>
import BoardPin from '~/components/board/Pin.vue';
import { useAuthStore } from '~/store/auth.js';

export default {
    name: 'BoardPage',
    components: { BoardPin },
    data() {
        return {
            // Board info
            boardTitle: '',
            boardDesc: '',
            boardColor: '',
            currentUserPerm: '',

            // Sorting
            selected: 'Created',
            sortDown: true,
            alwaysShowCardDetails: false,
        };
    },
    computed: {
        downArrowClass() {
            return this.sortDown ? 'down' : '';
        }
    },
    // Get board info + pins on page load
    created() {
        this.updateBoardInfo();
    },
    methods: {
        toggleSortDirection() {
            this.sortDown = !this.sortDown;
        },
        async updateBoardInfo() {
            try {
                let board = await this.$fetchApi('/api/board/boards/single', 'GET', { id: this.$route.query.id });
                console.log(board)
                this.boardTitle = board.name;
                this.boardDesc = board.desc;
                this.boardColor = board.color;
                this.currentUserPerm = board.perms[useAuthStore(this.$pinia).user.id]?.perm_level || '';
            } catch(e) {
                console.log(e)
                // TODO: error state
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";
@import "~/assets/css/sort.scss";
@import "~/assets/css/dropdown-menu.scss";

.container {
    max-width: calc(100% - $left-nav-width-pc) !important;
    margin-left: $left-nav-width-pc;
}

.subtitle { opacity: $secondary-text-opacity; }

.grid {
    column-count: 3;
    column-gap: 10px; // TODO: variable

    & > * {
        width: 100%;
    }
}
</style>
