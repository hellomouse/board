
<template>
    <v-dialog
        v-model="showModal"
        width="620"
    >
        <v-card rounded="0" width="620" class="py-1">
            <v-card-text class="px-4">
                <h1 class="mb-4 text-truncate">Copy to board</h1>

                <div>
                    <v-text-field
                        v-model="search"
                        label="" rounded="0"
                        prepend-inner-icon="mdi-magnify"
                        placeholder="Search Boards"
                        class="my-2"
                        density="compact"
                        clearable block
                        flat variant="solo-filled"

                        @keyup.enter="updateSearch"
                    />

                    <v-list density="compact" height="300">
                        <v-list-subheader>BOARDS YOU CAN EDIT</v-list-subheader>
                        <v-list-item
                            v-for="board in boards"
                            :key="board.id"
                            color="primary"

                            :title="board.name"
                            :subtitle="'@' + board.creator"
                            :active="selectedBoardId === board.id"

                            @click="selectedBoardId = board.id"
                        >
                            <template #prepend>
                                <v-icon icon="mdi-folder" :color="board.color"></v-icon>
                            </template>
                        </v-list-item>

                        <v-list-item>
                            <v-btn
                                v-if="!prevLoadWasEmpty"
                                variant="text" color="primary" block
                                @click="loadMoreBoards()"
                            >
                                Load more
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </div>
    
                <div class="d-flex mt-2">
                    <v-spacer />
                    <v-btn variant="text" color="primary" @click="$emit('update', { type: 'close' })">Cancel</v-btn>
                    <v-btn 
                        :disabled="boards.length === 0 || !selectedBoardId"
                        variant="text" color="primary" @click="performCopy()">Copy</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { SELFEDIT, OWNER, EDIT } from '~/helpers/board/perms.js';
import { pinTypeNameToNumber } from '~/helpers/board/pin.js';

const BOARDS_PER_PAGE = 50;

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
            page: 0,
            boards: [],
            selectedBoardId: '',
            search: '',
            prevSearch: '',
            prevLoadWasEmpty: false
        };
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
            if (newVal) this.loadBoards();
        }
    },
    async created() {
        await this.loadBoards();
    },
    methods: {
        // If fresh = false then concats, else overwrites
        async loadBoards(fresh = true) {
            if (fresh) this.page = 0;

            let opts = {
                not_self: false,
                offset: this.page * BOARDS_PER_PAGE,
                limit: BOARDS_PER_PAGE,
                sort_by: 'Name',
                sort_down: true
            };
            
            if (this.search.length > 2)
                opts.query = this.search;

            try {
                let boards = await this.$fetchApi('/api/board/boards', 'GET', opts);

                // Filter by boards the user can edit
                boards.boards = boards.boards.filter(b => {
                    let userid = useAuthStore(this.$pinia).user.id;
                    let perm = b.perms[userid].perm_level;
                    if (!perm) return false;
                    return [OWNER, EDIT, SELFEDIT].includes(perm);
                });

                this.boards = fresh ? boards.boards : this.boards.concat(boards.boards);
                this.prevSearch = this.search;
                this.prevLoadWasEmpty = boards.boards.length === 0;
            } catch (e) {
                let errorMsg = `Failed to get boards: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            } 
        },
        async loadMoreBoards() {
            this.page++;
            this.loadBoards(false);
        },
        async performCopy() {
            try {
                await this.$fetchApi('/api/board/pins', 'POST', {
                    pin_type: pinTypeNameToNumber(this.pin.type),
                    board_id: this.selectedBoardId,
                    flags: this.pin.flags || '',
                    content: this.pin.content,
                    attachment_paths: this.pin.attachment_paths,
                    metadata: this.pin.metadata
                });
                this.$emit('success', 'Pin copied to board!');
            } catch (e) {
                let errorMsg = `Failed to copy pin to board: ${this.$apiErrorToString(e)}`;
                this.$emit('error', errorMsg);
            }
            this.$emit('update', { type: 'close' });
        },
        updateSearch() {
            if (this.search === this.prevSearch) return;
            this.loadBoards();
        }
    }
}
</script>
