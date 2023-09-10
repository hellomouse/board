
<template>
    <div>
        <v-text-field
            v-if="search"
            v-model="searchVal"
            label="" rounded="0"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search Boards"
            class="my-2"
            density="compact"
            clearable block
            flat variant="solo-filled"

            @keyup.enter="updateSearch"
        />

        <v-list density="compact" :height="listHeight">
            <v-list-subheader>BOARDS {{ filterCanEdit ? 'YOU CAN EDIT' : '' }}</v-list-subheader>
            <v-list-item
                v-for="board in boards"
                :key="board.id"
                color="primary"

                :title="board.name"
                :subtitle="'@' + board.creator"
                :active="selectedBoardIds.has(board.id)"

                @click="toggleBoard(board.id)"
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
</template>

<script>
import { useAuthStore } from '~/store/auth.js';
import { SELFEDIT, OWNER, EDIT } from '~/helpers/board/perms.js';

const BOARDS_PER_PAGE = 50;

export default {
    props: {
        listHeight: {
            type: Number,
            default: 300
        },
        filterCanEdit: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: true
        },
        selected: {
            type: Array,
            default: () => []
        },
        includeSharedBoards: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showModal: this.show,
            page: 0,
            boards: [],
            selectedBoardIds: new Set(this.selected),
            searchVal: '',
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

            if (!this.includeSharedBoards)
                opts.owner_search = useAuthStore(this.$pinia).user.id;
            if (this.searchVal.length > 2)
                opts.query = this.searchVal;

            try {
                let boards = await this.$fetchApi('/api/board/boards', 'GET', opts);

                // Filter by boards the user can edit
                if (this.filterCanEdit) {
                    boards.boards = boards.boards.filter(b => {
                        let userid = useAuthStore(this.$pinia).user.id;
                        let perm = b.perms[userid].perm_level;
                        if (!perm) return false;
                        return [OWNER, EDIT, SELFEDIT].includes(perm);
                    });
                }

                this.boards = fresh ? boards.boards : this.boards.concat(boards.boards);
                this.prevSearch = this.searchVal;
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
        updateSearch() {
            if (this.searchVal === this.prevSearch) return;
            this.loadBoards();
        },
        toggleBoard(id) {
            let has = this.selectedBoardIds.has(id);
            if (this.multiple) {
                if (has) this.selectedBoardIds.delete(id);
                else     this.selectedBoardIds.add(id);
            } else
                this.selectedBoardIds = new Set(has ? [] : [id]);
            this.$emit('update:selected', [...this.selectedBoardIds]);
        }
    }
}
</script>
