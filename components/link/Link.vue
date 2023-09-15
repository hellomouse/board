<!--
    Credit goes to https://github.com/sethcottle/littlelink/tree/main
    For all the button assets and CSS
    (MIT license)
-->

<template>
    <div class="link">
        <!-- Amazon -->
        <a
            v-if="matchDomain(['amazon'], true)"
            class="button button-amazon" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/amazon.svg" alt="">Amazon Wishlist</a>

        <!-- Amazon Music -->
        <a
            v-else-if="matchDomain(['music.amazon'], true)"
            class="button button-amazon-music" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/amazon-music.svg" alt="">Listen on Amazon Music</a>       
        
        <!-- Apple App Store -->
        <a
            v-else-if="matchDomain(['apps.apple'], true)"
            class="button button-appstore" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/apple.svg" alt="">Apple App Store</a>

        <!-- Apple Music -->
        <a
            v-else-if="matchDomain(['music.apple'], true)"
            class="button button-apple-music" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/apple-music.svg" alt="">Listen on Apple Music</a>            
       
        <!-- Apple Podcasts -->
        <a
            v-else-if="matchDomain(['podcasters.apple'], true)"
            class="button button-apple-podcasts" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/apple-podcasts.svg" alt="">Listen on Apple Podcasts</a> 
        
        <!-- Bandcamp -->
        <a
            v-else-if="matchDomain(['bandcamp.com'], false, true)"
            class="button button-bandcamp" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/bandcamp.svg" alt="">Bandcamp</a> 

        <!-- Behance -->
        <a
            v-else-if="matchDomain(['behance.net'], false, true)"
            class="button button-behance" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/behance.svg" alt="">Behance</a> 

        <!-- Bluesky -->
        <a
            v-else-if="matchDomain(['bsky.app'], false, true)"
            class="button button-bluesky" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/bluesky.svg" alt="">Bluesky</a> 

        <!-- Cal.com -->
        <a
            v-else-if="matchDomain(['cal.com'], false, true)"
            class="button button-cal" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/cal.svg" alt="">Schedule with Cal.com</a>

        <!-- Calendly -->
        <a
            v-else-if="matchDomain(['calendly.com'], false, true)"
            class="button button-calendly" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/calendly.svg" alt="">Schedule with Calendly</a>

        <!-- Cash App -->
        <a
            v-else-if="matchDomain(['cash.app'], false, true)"
            class="button button-cash-app" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/cash-app-dollar.svg" alt="">Cash App</a>

        <!-- Clubhouse -->
        <a
            v-else-if="matchDomain(['clubhouse.com'], false, true)"
            class="button button-clubhouse" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/clubhouse.svg" alt="">Clubhouse</a>

        <!-- Dev.to -->
        <a
            v-else-if="matchDomain(['dev.to'], false, true)"
            class="button button-dev-to" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/dev-to.svg" alt="">Dev.to</a>

        <!-- Discord -->
        <a
            v-else-if="matchDomain(['discord.com', 'discord.gg'], false, true)"
            class="button button-discord" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/discord.svg" alt="">Discord</a>

        <!-- Dribbble -->
        <a
            v-else-if="matchDomain(['dribble.com'], false, true)"
            class="button button-dribbble" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/dribbble.svg" alt="">Dribbble</a>

        <!-- Etsy -->
        <a
            v-else-if="matchDomain(['etsy.com'], false, true)"
            class="button button-etsy" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/etsy.svg" alt="">Shop on Etsy</a>

        <!-- Facebook -->
        <a
            v-else-if="matchDomain(['facebook'], false)"
            class="button button-faceb" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/facebook.svg" alt="">Find us on Facebook</a>

        <!-- Facebook Messenger -->
        <a
            v-else-if="matchDomain(['m.me', 'messenger.com'], false)"
            class="button button-messenger" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/messenger.svg" alt="">Chat on Messenger</a>

        <!-- Figma -->
        <a
            v-else-if="matchDomain(['figma.com'], false, true)"
            class="button button-figma" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/figma.svg" alt="">Figma Community</a>

        <!-- Fiverr -->
        <a
            v-else-if="matchDomain(['fiverr.com'], false, true)"
            class="button button-fiverr" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/fiverr.svg" alt="">Fiverr Gig</a>

        <!-- Flickr -->
        <a
            v-else-if="matchDomain(['flickr.com'], false, true)"
            class="button button-flickr" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/flickr.svg" alt="">Flickr</a>

        <!-- GitHub -->
        <a
            v-else-if="matchDomain(['github.com', 'github.io'], false, true)"
            class="button button-github" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/github.svg" alt="">GitHub</a>

        <!-- GitLab -->
        <a
            v-else-if="matchDomain(['gitlab.com'], false, true)"
            class="button button-gitlab" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/gitlab.svg" alt="">GitLab</a>

        <!-- GoFundMe -->
        <a
            v-else-if="matchDomain(['gofundme.com'], false, true)"
            class="button button-gofundme" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/gofundme.svg" alt="">GoFundMe</a>

        <!-- Goodreads -->
        <a
            v-else-if="matchDomain(['goodreads.com'], false, true)"
            class="button button-goodreads" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/goodreads.svg" alt="">Goodreads</a>

        <!-- Google Drive -->
        <a
            v-else-if="matchDomain(['drive.google'], true, false)"
            class="button button-google-black" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/google-drive.svg" alt="">View in Google Drive</a>

        <!-- Google Play Store -->
        <a
            v-else-if="matchDomain(['play.google'], true, false)"
            class="button button-playstore" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/google-play.svg" alt="">Google Play Store</a>

        <!-- Google Podcasts -->
        <a
            v-else-if="matchDomain(['podcasts.google'], true, false)"
            class="button button-google-podcasts" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/google-podcasts.svg" alt="">Listen on Google Podcasts</a>

        <!-- Google Scholar -->
        <a
            v-else-if="matchDomain(['scholar.google'], true, false)"
            class="button button-google-scholar" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/google-scholar.svg" alt="">Google Scholar</a>

        <!-- Guilded -->
        <a
            v-else-if="matchDomain(['guilded.gg'], false, true)"
            class="button button-guilded" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/guilded.svg" alt="">Guilded</a>

        <!-- Hashnode -->
        <a
            v-else-if="matchDomain(['hashnode.com'], false, true)"
            class="button button-hashnode" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/hashnode.svg" alt="">Hashnode</a>

        <!-- Instagram -->
        <a
            v-else-if="matchDomain(['instagram.com'], false, true)"
            class="button button-instagram" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/instagram.svg" alt="">Instagram</a>

        <!-- Kick -->
        <a
            v-else-if="matchDomain(['kick.com'], false, true)"
            class="button button-kick" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/kick.svg" alt="">Kick</a>

        <!-- Kickstarter -->
        <a
            v-else-if="matchDomain(['kickstarter.com'], false, true)"
            class="button button-kickstarter" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/kickstarter.svg" alt="">Kickstarter</a>

        <!-- Kit -->
        <a
            v-else-if="matchDomain(['kit.co'], false, true)"
            class="button button-kit" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/kit.svg" alt="">Kit</a>

        <!-- Ko-fi -->
        <a
            v-else-if="matchDomain(['ko-fi.com'], false, true)"
            class="button button-ko-fi" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/ko-fi.svg" alt="">Ko-fi</a>

        <!-- Last.fm -->
        <a
            v-else-if="matchDomain(['last.fm'], false, true)"
            class="button button-last-fm" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/last-fm.svg" alt="">Last.fm</a>

        <!-- Letterboxd -->
        <a
            v-else-if="matchDomain(['letterboxd.com'], false, true)"
            class="button button-letterboxd" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/letterboxd.svg" alt="">Letterboxd</a>

        <!-- Line -->
        <a
            v-else-if="matchDomain(['line.me'], false, true)"
            class="button button-line" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/line.svg" alt="">Line</a>

        <!-- LinkedIn -->
        <a
            v-else-if="matchDomain(['linkedin.com'], false, true)"
            class="button button-linked" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/linkedin.svg" alt="">LinkedIn</a>

        <!-- Mailchimp -->
        <a
            v-else-if="matchDomain(['mailchimp.com'], false, true)"
            class="button button-mailchimp" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/mailchimp.svg" alt="">Mailchimp</a>

        <!-- Mastodon -->
        <a
            v-else-if="matchDomain(['mastodon.social'], false, true)"
            class="button button-mastodon" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/mastodon.svg" alt="">Mastodon</a>

        <!-- Medium -->
        <a
            v-else-if="matchDomain(['medium.com'], false, true)"
            class="button button-medium" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/medium.svg" alt="">Medium</a>
        
        <!-- NGL -->
        <a
            v-else-if="matchDomain(['ngl.link'], false, true)"
            class="button button-ngl" :href="urlSanitized" target="_blank" rel="noopener"><img class="icon" src="/link/icons/ngl.svg" alt="">NGL</a>
        
        <!-- Notion -->
        <a
            v-else-if="matchDomain(['notion.so'], false, true)"
            class="button button-notion" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/notion.svg" alt="">Notion</a>

        <!-- OnlyFans -->
        <a
            v-else-if="matchDomain(['onlyfans.com'], false, true)"
            class="button button-onlyfans" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/onlyfans.svg" alt="">OnlyFans (18+)</a>

        <!-- Patreon -->
        <a
            v-else-if="matchDomain(['patreon.com'], false, true)"
            class="button button-patreon" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/patreon.svg" alt="">Patreon</a>

        <!-- PayPal -->
        <a
            v-else-if="matchDomain(['paypal.com'], false, true)"
            class="button button-paypal" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/paypal.svg" alt="">PayPal</a>

        <!-- Pinterest -->
        <a
            v-else-if="matchDomain(['pinterest.com'], false, true)"
            class="button button-pinterest" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/pinterest.svg" alt="">Pinterest</a>

        <!-- Post.news -->
        <a
            v-else-if="matchDomain(['post.news'], false, true)"
            class="button button-post-news" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/post-news.svg" alt="">Post.news</a>

        <!-- Product Hunt -->
        <a
            v-else-if="matchDomain(['producthunt.com'], false, true)"
            class="button button-product-hunt" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/product-hunt.svg" alt="">Product Hunt</a>

        <!-- Read.cv -->
        <a
            v-else-if="matchDomain(['read.cv'], false, true)"
            class="button button-read-cv" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/read-cv.svg" alt="">Read.cv</a>

        <!-- Redbubble -->
        <a
            v-else-if="matchDomain(['redbubble.com'], false, true)"
            class="button button-redbubble" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/redbubble.svg" alt="">Redbubble</a>

        <!-- Reddit -->
        <a
            v-else-if="matchDomain(['reddit.com'], false, true)"
            class="button button-reddit" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/reddit.svg" alt="">Reddit</a>

        <!-- Shop -->
        <a
            v-else-if="matchDomain(['shop.app'], false, true)"
            class="button button-shop" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/shop.svg" alt="">Buy with Shop</a>

        <!-- Signal -->
        <a
            v-else-if="matchDomain(['signal.org'], false, true)"
            class="button button-signal" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/signal.svg" alt="">Signal</a>

        <!-- Skoob -->
        <a
            v-else-if="matchDomain(['skoob.com'], false, true)"
            class="button button-skoob" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/skoob.svg" alt="">Skoob</a>

        <!-- Slack -->
        <a
            v-else-if="matchDomain(['slack.com'], false, true)"
            class="button button-slack" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/slack.svg" alt="">Join Slack</a>

        <!-- Snapchat -->
        <a
            v-else-if="matchDomain(['snapchat.com'], false, true)"
            class="button button-snapchat" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/snapchat.svg" alt="">Snapchat</a>

        <!-- SoundCloud -->
        <a
            v-else-if="matchDomain(['soundcloud.com'], false, true)"
            class="button button-soundcloud" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/soundcloud.svg" alt="">SoundCloud</a>

        <!-- Spotify -->
        <a
            v-else-if="matchDomain(['spotify.com'], false, true)"
            class="button button-spotify" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/spotify.svg" alt="">Listen on Spotify</a>

        <!-- Square -->
        <a
            v-else-if="matchDomain(['squareup.com'], false, true)"
            class="button button-square" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/square.svg" alt="">Buy with Square</a>

        <!-- Steam -->
        <a
            v-else-if="matchDomain(['steampowered.com', 'steamcommunity.com/'], false, true)"
            class="button button-steam" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/steam.svg" alt="">Steam</a>

        <!-- Strava -->
        <a
            v-else-if="matchDomain(['strava.com'], false, true)"
            class="button button-strava" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/strava.svg" alt="">Strava</a>

        <!-- Substack -->
        <a
            v-else-if="matchDomain(['substack.com'], false, true)"
            class="button button-substack" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/substack.svg" alt="">Substack</a>

        <!-- Telegram -->
        <a
            v-else-if="matchDomain(['telegram.org'], false, true)"
            class="button button-telegram" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/telegram.svg" alt="">Telegram</a>

        <!-- Threads -->
        <a
            v-else-if="matchDomain(['threads.net'], false, true)"
            class="button button-threads" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/threads.svg" alt="">Threads</a>

        <!-- Threema -->
        <a
            v-else-if="matchDomain(['threema.ch'], false, true)"
            class="button button-threema" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/threema.svg" alt="">Threema</a>

        <!-- TikTok -->
        <a
            v-else-if="matchDomain(['tiktok.com'], false, true)"
            class="button button-tiktok" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/tiktok.svg" alt="">TikTok</a>

        <!-- Trello -->
        <a
            v-else-if="matchDomain(['trello.com'], false, true)"
            class="button button-trello" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/trello.svg" alt="">Trello</a>

        <!-- Tumblr -->
        <a
            v-else-if="matchDomain(['tumblr.com'], false, true)"
            class="button button-tumb" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/tumblr.svg" alt="">Tumblr</a>

        <!-- Twitch -->
        <a
            v-else-if="matchDomain(['twitch.tv'], false, true)"
            class="button button-twitch" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/twitch.svg" alt="">Twitch</a>

        <!-- Twitter (archiving soon, see 'X') -->
        <a
            v-else-if="matchDomain(['twitter.com'], false, true)"
            class="button button-twit" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/twitter.svg" alt="">Twitter</a>

        <!-- Unsplash -->
        <a
            v-else-if="matchDomain(['unsplash.com'], false, true)"
            class="button button-unsplash" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/unsplash.svg" alt="">Unsplash</a>

        <!-- Untappd -->
        <a
            v-else-if="matchDomain(['untappd.com'], false, true)"
            class="button button-untappd" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/untappd.svg" alt="">Untappd</a>

        <!-- Upwork -->
        <a
            v-else-if="matchDomain(['upwork.com'], false, true)"
            class="button button-upwork" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/upwork.svg" alt="">Upwork</a>

        <!-- Venmo -->
        <a
            v-else-if="matchDomain(['venmo.com'], false, true)"
            class="button button-venmo" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/venmo.svg" alt="">Venmo</a>

        <!-- Vimeo -->
        <a
            v-else-if="matchDomain(['vimeo.com'], false, true)"
            class="button button-vimeo" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/vimeo.svg" alt="">Vimeo</a>

        <!-- VSCO -->
        <a
            v-else-if="matchDomain(['vsco.co'], false, true)"
            class="button button-vsco" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/vsco.svg" alt="">VSCO</a>

        <!-- WhatsApp -->
        <a
            v-else-if="matchDomain(['whatsapp.com'], false, true)"
            class="button button-whatsapp" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/whatsapp.svg" alt="">WhatsApp</a>

        <!-- WordPress -->
        <a
            v-else-if="matchDomain(['wordpress.com'], false, true)"
            class="button button-wordpress" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/wordpress.svg" alt="">WordPress</a>

        <!-- X -->
        <a
            v-else-if="matchDomain(['x.com'], false, true)"
            class="button button-x" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/x.svg" alt="">Follow on X</a>

        <!-- Xing -->
        <a
            v-else-if="matchDomain(['xing.com'], false, true)"
            class="button button-xing" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/xing.svg" alt="">Xing</a>

        <!-- YouTube -->
        <a
            v-else-if="matchDomain(['youtube', 'youtu'], true, true)"
            class="button button-yt" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/youtube.svg" alt="">YouTube</a>        

        <!-- Zoom -->
        <a
            v-else-if="matchDomain(['zoom.com', 'zoom.us'], false, true)"
            class="button button-zoom" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/zoom.svg" alt="">Join Zoom Webinar</a>  

        <!-- 500px -->
        <a 
            v-else-if="matchDomain(['500px.com'], false, true)"
            class="button button-500px" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/500px.svg" alt="500px Logo">500px</a>
        

        <!-- Alpha Universe (Sony) -->
        <a 
            v-else-if="matchDomain(['alphauniverse.com'], false, true)"
            class="button button-alphauniverse" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/alphauniverse.png" alt="Alpha Universe Logo">Universe</a>
        

        <!-- Anilist -->
        <a 
            v-else-if="matchDomain(['anilist.co'], false, true)"
            class="button button-anilist" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/anilist.svg" alt="Anilist Logo">Anilist</a>
        

        <!-- Behance -->
        <a 
            v-else-if="matchDomain(['behance.net'], false, true)"
            class="button button-behance" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/behance.svg" alt="Behance Logo">Behance</a>
        

        <!-- Codepen -->
        <a 
            v-else-if="matchDomain(['codepen.io'], false, true)"
            class="button button-codepen" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/codepen.svg" alt="Codepen Logo">Codepen</a>
        

        <!-- Devpost -->
        <a 
            v-else-if="matchDomain(['devpost.com'], false, true)"
            class="button button-devpost" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon icon-invert" src="/link/icons/devpost.svg" alt="Devpost Logo">Devpost</a>
        

        <!-- Distiller -->
        <a 
            v-else-if="matchDomain(['distiller.com'], false, true)"
            class="button button-dist" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/distiller.svg" alt="Distiller Logo">Distiller</a>
        

        <!-- Hackerearth -->
        <a 
            v-else-if="matchDomain(['hackerearth.com'], false, true)"
            class="button button-hackerearth" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/hackerearth.svg" alt="HackerRank Logo">HackerEarth</a>
        

        <!-- Hackerrank -->
        <a 
            v-else-if="matchDomain(['hackerrank.com'], false, true)"
            class="button button-hackerrank" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/hackerrank.svg" alt="HackerRank Logo">HackerRank</a>
        

        <!-- Itch.io -->
        <a 
            v-else-if="matchDomain(['itch.io'], false, true)"
            class="button button-itchio" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/itchio.svg" alt="itchio Logo">itch.io</a>
        
        <!-- Matrix -->
        <a 
            v-else-if="matchDomain(['matrix.org'], false, true)"
            class="button button-matrix" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/matrix.svg" alt="Matrix Logo">Matrix</a>

        <!-- MicroBlog -->
        <a 
            v-else-if="matchDomain(['micro.blog'], false, true)"
            class="button button-microblog" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/microblog.svg" alt="MicroBlog Logo">MicroBlog</a>
        

        <!-- MyAnimeList -->
        <a 
            v-else-if="matchDomain(['myanimelist.net'], false, true)"
            class="button button-myanimelist" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/myanimelist.svg" alt="MyAnimeList Logo">MyAnimeList</a>
        
        
        <!-- OP.GG -->
        <a 
            v-else-if="matchDomain(['op.gg'], false, true)"
            class="button button-opgg" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/opgg.svg" alt="OP.GG Logo">OP.GG</a>
        

        <!-- ORCID ID -->
        <a 
            v-else-if="matchDomain(['orcid.org'], false, true)"
            class="button button-orcid-id" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/orcid-id.svg" alt="ORCID ID Logo">ORCID ID</a>
        

        <!-- osu! -->
        <a 
            v-else-if="matchDomain(['osu.ppy.ssh'], false, false)"
            class="button button-osu" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/osu.svg" alt="osu! Logo">osu!</a>
        

        <!-- Pixelfed -->
        <a 
            v-else-if="matchDomain(['pixelfed.org'], false, true)"
            class="button button-pixelfed" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/pixelfed.svg" alt="Pixelfed Logo">Pixelfed</a>
        
        
        <!-- ResearchGate -->
        <a 
            v-else-if="matchDomain(['researchgate.net'], false, true)"
            class="button button-researchgate" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/researchgate.svg" alt="ResearchGate Logo">ResearchGate</a>
        
        
        <!-- SpaceHey -->
        <a 
            v-else-if="matchDomain(['spacehey.com'], false, true)"
            class="button button-spacehey" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/spacehey.svg" alt="SpaceHey Logo">SpaceHey</a>
        

        <!-- Vero -->
        <a 
            v-else-if="matchDomain(['vero.co'], false, true)"
            class="button button-vero" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/vero.svg" alt="Vero Logo">Vero</a>
        

        <!-- Write.as -->
        <a 
            v-else-if="matchDomain(['write.as'], false, true)"
            class="button button-writeas" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/writeas.svg" alt="Write.as Logo">Write.as</a>
        

        <!-- Writefreely -->
        <a 
            v-else-if="matchDomain(['writefreely.org'], false, true)"
            class="button button-writefreely" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/writefreely.svg" alt="WriteFreely Logo">WriteFreely</a>


        <!-- Pixiv -->
        <a 
            v-else-if="matchDomain(['pixiv.net'], false, true)"
            class="button button-pixiv" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/pixiv.svg" alt="Pixiv Logo">Pixiv</a>

        <!-- Bilibili -->
        <a 
            v-else-if="matchDomain(['bilibili.com'], false, true)"
            class="button button-bilibili" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/bilibili.svg" alt="Bilibili Logo">Bilibili</a>

        <!-- Keybase -->
        <a 
            v-else-if="matchDomain(['keybase.io'], false, true)"
            class="button button-keybase" :href="urlSanitized" target="_blank" rel="noopener">
            <img class="icon" src="/link/icons/keybase.svg" alt="Keybase Logo">Keybase</a>


        <!-- Generic Blog -->
        <a
            v-else-if="url.includes('blog')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-blog.svg" alt="">Read our blog</a>

        <!-- Generic Calendar -->
        <a
            v-else-if="url.includes('calendar')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-calendar.svg" alt="">Event RSVP</a>

        <!-- Generic Email -->
        <a
            v-else-if="url.startsWith('mailto:')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-email.svg" alt="">Email Us</a>

        <!-- Generic Homepage -->
        <a
            v-else-if="url.startsWith('https://hellomouse.net/~')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-homepage.svg" alt="">Visit Homepage</a>

        <!-- Generic Map -->
        <a
            v-else-if="url.includes('maps.google.com')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-map.svg" alt="">Get Directions</a>

        <!-- Generic Phone -->
        <a
            v-else-if="url.startsWith('tel:')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-phone.svg" alt="">Call Us</a>

        <!-- Generic RSS -->
        <a
            v-else-if="url.includes('rss') || url.includes('feed')"
            class="button button-default" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-rss.svg" alt="">RSS Subscribe</a>

        <!-- Generic Website -->
        <a
            v-else
            class="button button-default text-truncate" :href="urlSanitized" target="_blank" rel="noopener"
            role="button"><img class="icon" src="/link/icons/generic-website.svg" alt="">Visit {{ hostname || 'website' }}</a>
    </div>
</template>

<script>
import '~/assets/css/link/brands.css';
import '~/assets/css/link/brands-extended.css';

export default {
    props: {
        url: {
            required: true,
            type: String
        },
        linkId: {
            required: true,
            type: Number
        },
        showDelete: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hostname() {
            try {
                let host = (new URL(this.url)).hostname;
                if (host.startsWith('www.')) host = host.replace('www.', '');
                return host;
            } catch(e) {
                return '';
            }
        },
        canon() {
            const MAX_TLD_LENGTH = 3;
            // eslint-disable-next-line jsdoc/require-jsdoc
            function isNotTLD(_) { return _.length > MAX_TLD_LENGTH; };
            let hostname = this.hostname.split('.');
            hostname = hostname.slice(Math.max(0, hostname.findLastIndex(isNotTLD)));
            hostname = hostname.join('.');
            return hostname;
        },
        urlSanitized() {
            if (this.url.startsWith('javascript:')) return '';
            return this.url;
        }
    },
    methods: {
        matchDomain(domains, ignoreExt = false, canonical = false) {
            try {
                let url = this.hostname;
                if (canonical) url = this.canon;
                if (ignoreExt) {
                    let tmp = this.canon.split('.')[0];
                    url = url.split(tmp)[0] + tmp;
                }
                return domains.some(x => x === url);
            } catch(e) {
                return false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.link {
    max-width: 100%;
    box-sizing: border-box;
}
</style>