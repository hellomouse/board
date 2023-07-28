<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
});
</script>

<template>
    <!-- A page to show all the boards the user has -->
    <div>
        <NuxtLayout name="board">
            <BoardBoard
                v-for="board in boards"
                :key="board.id"

                :board-id="board.id"
                :title="board.name"
                :desc="board.desc"
                :creator-id="board.creator"
                :color="board.color"

                @update="onBoardUpdate"
            ></BoardBoard>
        </NuxtLayout>
    </div>
</template>

<script>
import BoardBoard from '~/components/board/Board.vue';

export default {
    name: 'BoardIndexPage',
    components: { BoardBoard },
    data: () => ({
        boards: []
    }),
    async created() {
        this.getBoards();
    },
    methods: {
        async getBoards() {
            try {
                // eslint-disable-next-line no-undef
                let boards = await this.$fetchApi('/api/board/boards', 'GET', {});
                this.boards = boards.boards;
                console.log(boards.boards)
            } catch (e) {
                console.log(e);
                return;
            }
        },
        async onBoardUpdate(msg) {
            if (msg === 'board_delete') // Board was deleted
                await this.getBoards();
        }
    }
}
</script>