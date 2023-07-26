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
            <div class="grid">
                <BoardPin v-for="index in 10" :key="index" 
                    creator="helloasdad1231521613123131312313131231313212312313131312"
                    created="1:00 AM 12/12/12"
                    edited="1:00 AM 12/12/12"
                    flags="LOCKED"
                    class="mb-1"
                />
            </div>
        </NuxtLayout>
    </div>
</template>

<script>
import BoardPin from '~/components/board/Pin.vue';

export default {
    name: 'BoardPage',
    components: { BoardPin }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.grid {
    column-count: 3;
    column-gap: 10px; // TODO: variable

    & > * {
        width: 100%;
    }
}
</style>
