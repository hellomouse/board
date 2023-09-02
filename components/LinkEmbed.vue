<!-- TODO load opengraph data -->

<template>
    <div class="container">
        <iframe
            v-if="youtubeId"
            class="max-width mb-2"
            :src="'https://www.youtube.com/embed/' + youtubeId" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
        <iframe
            v-else-if="isTweet" border="0" frameborder="0"
            class="max-width mb-2" height="400"
            :src="'https://twitframe.com/show?url=' + encodeURIComponent(url)" />
        <iframe
            v-else-if="bilibiliId"
            class="max-width mb-2"
            height="200"
            :src="`//player.bilibili.com/player.html?bvid=${bilibiliId}&page=3&high_quality=1&autoplay=false`"
            scrolling="no" border="0" frameborder="no"
            framespacing="0" allowfullscreen="true"
        />
        <div
            class="d-flex link-meta"
        >
            <div style="width: 60px; height: 60px; background: red"></div>
            <div class="px-2 link-meta-text">
                <a target="_blank" :href="url">
                    <h3 class="text-truncate">Website Title</h3>
                    <p class="text-truncate">desc</p>
                    <p class="text-truncate text-blue link-meta-url"><small>{{ url }}</small></p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        url: {
            required: true,
            type: String
        }
    },
    data() {
        let yt = this.url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
        let bilibiliId = this.url.includes('bilibili.com/') ?
            (this.url.includes('/video') ?
                this.url.split('video/')[1] :
                this.url.split('bvid=')[1].split('&')[0]) : false;
        return {
            youtubeId: (yt && yt[7].length === 11) ? yt[7] : false,
            isTweet: this.url.includes('twitter.com/'),
            bilibiliId: bilibiliId || false
        };
    }
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 100%;
}

.max-width {
    display: block;
    max-width: 100% !important;
    width: 100% !important;
}

.link-meta {
    background-color: rgba(var(--v-theme-on-surface), 0.04);

    .link-meta-text {
        max-width: 240px;
        width: 100%;
        padding-top: 4px;

        .link-meta-url {
            font-size: 0.75rem;
            margin-top: 4px;
            display: block;
            opacity: 1;
        }

        p {
            opacity: var(--v-medium-emphasis-opacity);
            line-height: 10px;
            font-size: 0.85rem;
        }
        a {
            text-decoration: none !important;
            color: rgb(var(--v-theme-on-surface)) !important;
        }
    }
}
</style>