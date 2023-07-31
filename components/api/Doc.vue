<template>
    <v-card rounded="0" class="mb-4 mr-4 api-card" width="500">
        <div class="pa-4 api-card__title-bar">
            <h1 class="mb-2">{{ title }}</h1>
            <div class="api-card__title-bar__sub">
                <span
                    class="api-card__title-bar__method"
                    :class="'bg-' + methodColor"
                >{{ method }}</span>
                <code>{{ endpoint }}</code>
                {{ paramType }}

                <span v-if="auth" class="ml-2 bg-red pa-1">!Requires auth</span>
            </div>
        </div>

        <div class="api-card__contents pa-4">
            <slot />
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'ApiDoc',
    props: {
        title: { type: String, required: true },
        method: { type: String, required: true },
        endpoint: { type: String, required: true },
        paramType: { type: String, required: true },
        auth: { type: Boolean, default: false },
    },
    computed: {
        methodColor() {
            let method = this.method.toLowerCase();
            if (method === 'post') return 'orange';
            if (method === 'get') return 'blue';
            if (method === 'delete') return 'red';
            return 'green';
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>