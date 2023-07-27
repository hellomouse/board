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
            <!-- Sort options -->
            <div class="mb-2">
                Sort by: 
                <v-select
                    v-model="selected" density="compact" solo-filled max-width="200"
                    flat class="select mr-2"
                    :items="['Created', 'Modified']"
                ></v-select>
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
        </NuxtLayout>
    </div>
</template>

<script>
import BoardPin from '~/components/board/Pin.vue';

export default {
    name: 'BoardPage',
    components: { BoardPin },
    data() {
        return {
            selected: ''
        };
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.select {
    width: 200px;
    max-width: 200px;
    display: inline-block;
}

.grid {
    column-count: 3;
    column-gap: 10px; // TODO: variable

    & > * {
        width: 100%;
    }
}
</style>
