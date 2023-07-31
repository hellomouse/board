<template>
    <NuxtLink :to="href" class="logo [ d-flex flex-row align-center ] ml-4">
        <img class="logo__img [ mr-4 ]" :src="src" alt="logo" />
        <h1 class="logo__title">{{ title }}</h1>
    </NuxtLink>
</template>

<script>
export default {
    name: 'AppLogo',
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
.logo {
    height: 100%;
    text-decoration: none !important;

    &__img {
        height: 64%;

        image-rendering: -moz-crisp-edges;         /* Firefox */
        image-rendering:   -o-crisp-edges;         /* Opera */
        image-rendering: -webkit-optimize-contrast;/* Webkit (non-standard naming) */
        image-rendering: crisp-edges;
    }

    &__title {
        color: rgb(var(--v-theme-on-surface));
        font-size: 2.5rem;
        letter-spacing: -0.05rem;
        font-weight: normal;
        opacity: 0.94;
    }
}
</style>