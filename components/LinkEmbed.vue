<!-- TODO load opengraph data -->

<template>
    <div class="container">
        <iframe
            v-if="youtubeId"
            class="max-width"
            :src="'https://www.youtube.com/embed/' + youtubeId" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
        <iframe
            v-if="isTweet" border="0" frameborder="0"
            class="max-width" height="400"
            :src="'https://twitframe.com/show?url=' + encodeURIComponent(url)" />
        <iframe
            v-if="bilibiliId"
            class="max-width"
            height="200"
            :src="`//player.bilibili.com/player.html?bvid=${bilibiliId}&page=3&high_quality=1&autoplay=false`"
            scrolling="no" border="0" frameborder="no"
            framespacing="0" allowfullscreen="true"
        />
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
</style>