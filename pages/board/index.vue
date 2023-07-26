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
            <BoardBoard title="Hello" creatorId="bowserinator" color="#FF0000"></BoardBoard>
            <BoardBoard title="Minecraft Build Inspirtation" desc="Cool builds in Minecraft" creatorId="bowserinator" color="#FFFF00"></BoardBoard>
            <BoardBoard title="Cool websites" creatorId="bowserinator" color="#FFFFFF"></BoardBoard>
            <BoardBoard title="Random Code Snippets" creatorId="bowserinator" color="#AA0011"></BoardBoard>
            <BoardBoard title="Hello 131312312323132131o" desc="this is a super long description 1231312241231231" creatorId="bowserinator1231313131313131" color="#FF00FF"></BoardBoard>
        </NuxtLayout>
    </div>
</template>

<script>
import BoardBoard from '~/components/board/Board.vue';

export default {
    name: 'BoardIndexPage',
    components: { BoardBoard }
}
</script>