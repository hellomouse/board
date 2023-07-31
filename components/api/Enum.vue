<template>
    <v-card rounded="0" class="mb-4 mr-4 card" width="500">
        <div class="pa-4 api-title-bar">
            <h1>{{ title }}</h1>
        </div>

        <div class="contents pa-4">
            {{ desc }}
            
            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Enum</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="e in enums" :key="e[0]">
                        <td>{{ e[0] }}</td>
                        <td>{{ e[1] }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'ApiDoc',
    props: {
        title: { type: String, required: true },
        desc: { type: String, required: true },
        enums: { type: Array, required: true },
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";

// TODO: share css
$chip-padding: 4px;

.card {
    display: inline-block;
    vertical-align: top;
}

.api-title-bar {
    background-color: rgba(var(--v-theme-on-background), 0.05);
}

.contents {
    background: rgba(0, 0, 0, 0.15);
}
</style>