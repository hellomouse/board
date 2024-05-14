<template>
    <div>
        <p v-if="content.length > 1">{{ content }}</p>

        <div class="fixed-img-view-size">
            <img :src="`/api/files/single?id=${(attachmentPaths[currIndexMod] || '').split(',')[0]}`" />
            <v-btn icon="mdi-arrow-right" class="btn-right" @click="currIndex++" />
            <v-btn icon="mdi-arrow-left" class="btn-left" @click="currIndex--" />
            <small class="position">{{ attachmentPaths.length ? currIndexMod + 1 : 0 }} / {{ attachmentPaths.length }}</small>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
        attachmentPaths: {
            required: true,
            type: Array
        }
    },
    data() {
        return {
            currIndex: 0
        };
    },
    computed: {
        currIndexMod() {
            if (!this.attachmentPaths.length) return 0;
            let val = this.currIndex % this.attachmentPaths.length;
            while (val < 0) val += this.attachmentPaths.length;
            return val;
        }
    },
}
</script>

<style lang="scss" scoped>
.fixed-img-view-size {
    background: black;
    width: 100%;
    height: 260px;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
    }

    .btn-right, .btn-left {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        opacity: 0.0;
        transition: opacity 0.2s;
        height: 100%;
        
        &:hover { opacity: 0.7; }
    }

    .btn-right { right: 0; }
    .btn-left { left: 0; }

    .position {
        position: absolute;
        bottom: 2px;
        padding: 0 2px;
        display: block;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.6);
    }
}
</style>