<template>
    <VFooter class="footer d-flex justify-center pt-3 pb-6" color="transparent">
        Hellomouse Apps &copy; {{ year }}
    </VFooter>
</template>

<script>
export default {
    name: 'AppFooter',
    data() {
        return {
            year: (new Date()).getFullYear()
        };
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.footer {
    opacity: $secondary-text-opacity;
    max-height: 40px;
    background: none !important;
}
</style>