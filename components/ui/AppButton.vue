<template>
    <NuxtLink :to="href" class="logo">
        <img class="logo__img" :src="src" alt="logo" />
        <p class="logo__title">{{ title }}</p>
    </NuxtLink>
</template>

<script>
export default {
    props: {
        href: {
            type: String,
            required: true
        },
        src: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
@import "~/assets/variables.scss";

$width: 64px;

.logo {
    width: $width;
    text-decoration: none !important;
    color: var(--text-muted);
    padding-bottom: 4px;
    display: inline-block;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgb(var(--v-theme-on-surface-variant));
    }

    &__img {
        width: $width;
        height: $width;
        padding: 10px;
        box-sizing: border-box;
    }

    &__title {
        width: $width;
        text-align: center;
        margin-top: -8px;
    }
}
</style>