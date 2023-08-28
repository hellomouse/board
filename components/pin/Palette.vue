<!--
Example usage:

<pin-palette
    :selectedSwatchIndex="selectedSwatchIndex"
    @color="update => { [color, selectedSwatchIndex] = [update.color, update.index]; }"
/>
-->

<template>
    <div>
        <span v-for="(col, index) in SWATCHES" :key="col">
            <v-tooltip :text="SWATCH_NAMES[index]" location="top">
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        density="compact" width="40" style="min-width: 40px;"
                        :style="{ background: getBackground(getColor(col, isLight, 0.3)) }"
                        class="color-btn mr-1 mb-1"
                        @click="$emit('color', { color: col, index: index })"
                    >
                        <v-icon v-if="selectedSwatchIndex === index" icon="mdi-check" />
                    </v-btn>
                </template>
            </v-tooltip>

            <br v-if="SWATCHES[index + 1] && SWATCHES[index + 1].startsWith('#AA00') && !SWATCHES[index].startsWith('#AA00')" />
        </span>
    </div>
</template>

<script>
import { SWATCHES, SWATCH_NAMES, getColor, getBackground } from '~/helpers/board/pin-colors.js';
import { useOptionStore } from '~/store/optionStore.js';

export default {
    props: {
        selectedSwatchIndex: {
            required: true,
            type: Number
        }
    },
    data() {
        return { SWATCHES, SWATCH_NAMES }
    },
    computed: {
        isLight() { return !useOptionStore(this.$pinia).dark_theme; }
    },
    methods: { getColor, getBackground }
}
</script>

<style scoped lang="scss">
.color-btn {
    background-size: cover !important;
    background-position: center !important;
}
</style>