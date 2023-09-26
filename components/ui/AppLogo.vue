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
@import "~/assets/variables.scss";

.logo {
    height: 100%;
    width: $left-nav-width-pc;
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

@media only screen and (max-width: 600px) {
    .logo__title {
        display: none;
    }
}
</style>