<!-- TODO load opengraph data -->

<template>
    <div class="container">
        <!-- Fake video iframes that load on click -->
        <div v-if="youtubeId && !iframeInteract" class="video-img-wrapper">
            <img
                class="max-width mb-2 video-img"
                loading="lazy"
                height="200"
                :src="fallbackImgSrc"
                onerror="this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='"
                @click="iframeInteract = true"
            />
        </div>
        <div v-if="bilibiliId && !iframeInteract" class="video-img-wrapper">
            <img
                class="max-width mb-2 video-img"
                loading="lazy"
                height="200"
                :src="fallbackImgSrc"
                onerror="this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='"
                @click="iframeInteract = true"
            />
        </div>

        <!-- Video iframes that only load after click -->
        <iframe
            v-if="youtubeId && iframeInteract"
            class="max-width mb-2"
            loading="lazy"
            height="200"
            :src="'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1'" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
        <iframe
            v-else-if="bilibiliId && iframeInteract"
            loading="lazy"
            class="max-width mb-2"
            height="200"
            :src="`//player.bilibili.com/player.html?bvid=${bilibiliId}&page=3&high_quality=1&autoplay=true`"
            scrolling="no" border="0" frameborder="no"
            framespacing="0" allowfullscreen="true"
        />

        <!-- Other -->
        
        <iframe
            v-else-if="isTweet" border="0" frameborder="0"
            loading="lazy"
            class="max-width mb-2" height="400"
            :src="'https://twitframe.com/show?url=' + encodeURIComponent(url)" />
    
        <div class="d-flex link-meta">
            <img 
                :src="imgSrc" class="meta-image" alt="link-preview" loading="lazy"
                :onerror="fallback" />
            <div class="px-2 link-meta-text">
                <a target="_blank" :href="url">
                    <h3 class="text-truncate">{{ title || 'No title provided' }}</h3>
                    <p class="text-truncate">{{ desc || 'No description provided' }}</p>
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
        },
        title: {
            type: String,
            default: 'No title provided'
        },
        desc: {
            type: String,
            default: 'No description provided'
        },
        imgSrc: {
            type: String,
            default: ''
        },
        fallbackImgSrc: {
            type: String,
            default: ''
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
            bilibiliId: bilibiliId || false,

            iframeInteract: false,
            fallback: `if (this.src !== '${this.fallbackImgSrc || ''}' && '${this.fallbackImgSrc || ''}' !== '') { this.src = '${this.fallbackImgSrc || ''}'; } else { this.style.display = 'none'; }`
        };
    }
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 100%;
}

.video-img-wrapper {
    position: relative;

    &:after {
        content: '';
        background: url('/video-play.png'), linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        pointer-events: none;
    }

    .video-img {
        cursor: pointer;
        object-fit: cover;
    }
}

.max-width {
    display: block;
    max-width: 100% !important;
    width: 100% !important;
}

.meta-image {
    width: 60px;
    height: 60px;
    background: #444;
    display: block;
    object-fit: cover;
}

.link-meta {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
    overflow: hidden;

    .link-meta-text {
        max-width: 200px;
        width: 100%;
        padding-top: 4px;
        height: 60px;

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