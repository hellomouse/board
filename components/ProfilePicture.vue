

<template>
    <div class="user__pfp" :style="{ width: size, height: size, flex: `0 0 ${size}` }">
        <img
            :src="`/api/files/pfp?id=${userId}`" 
            alt="Profile picture"
            @error="$event.target.src = '/default-pfp.png'"
        >
    </div>
</template>

<script>
export default {
    name: 'ProfilePicture',
    props: {
        userId: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '40px'
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.user__pfp {
    overflow: hidden;
    border-radius: 50%;
    background-color: white;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        object-position: center;
    }
}
</style>
