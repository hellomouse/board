<template>
    <div>
        <p class="para mb-2">{{ desc }}</p>
        <link-embed class="mb-2" :url="url" />
    </div>
</template>

<script>
export default {
    props: {
        content: {
            required: true,
            type: String
        }
    },
    data() {
        const lines = this.content.split('\n');
        return {
            url: lines[0].startsWith('http') ? lines[0] : 'https://' + lines[0],
            desc: lines[1] || ''
        };
    },
    watch: {
        content() {
            const lines = this.content.split('\n');
            this.url = lines[0].startsWith('http') ? lines[0] : 'https://' + lines[0];
            this.desc = lines[1] || '';
        }
    }
}
</script>

<style lang="scss" scoped>
.para {
    word-break: break-word;
}

.link {
    font-size: 0.85rem;
    opacity: 0.8;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 250px;
    display: block;
}
</style>