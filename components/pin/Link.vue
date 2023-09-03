<template>
    <div>
        <p class="para mb-2">{{ desc }}</p>
        <link-embed
            class="mb-2"
            :url="url"
            :title="title"
            :desc="metaDesc"
            :img-src="imgUrlFast"
            :fallback-img-src="imgUrl"
        />
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
        let url = lines[0].startsWith('http') ? lines[0] : 'https://' + lines[0];
        return {
            url: url,
            desc: lines[1] || '',
            imgUrl: lines[2],
            title: lines[3],
            metaDesc: lines[4],
            imgUrlFast: `/files/thumb/${this.urlHash(url)}.webp`
        };
    },
    watch: {
        content() {
            const lines = this.content.split('\n');
            this.url = lines[0].startsWith('http') ? lines[0] : 'https://' + lines[0];
            this.desc = lines[1] || '';
 
            this.imgUrl = lines[2];
            this.title = lines[3];
            this.metaDesc = lines[4];
            this.imgUrlFast = `/files/thumb/${this.urlHash(this.url)}.webp`;
        }
    },
    methods: {
        // Same as in the microservice
        urlHash(str) {
            let hash = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                let chr = str.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0; // Convert to 32bit integer
            }
            let u = str.split('://')[1];
            return u.replace(/[^A-Za-z0-9_-]/g, '').substring(0, 210) + hash;
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