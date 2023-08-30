<template>
    <v-container class="text-center">
        <h1 class="title">Hellomouse Apps</h1>
    
        <div class="mt-15 app-container">
            <ui-app-button
                v-for="app in APPS" :key="app.href"
                :href="app.href"
                :src="app.src"
                :title="app.title"
            />
        </div>

        <div class="bottom">
            For credits, license, and setup instructions please see the github repos below:<br>
            <a href="https://github.com/hellomouse/board">Frontend</a> &nbsp; | &nbsp;
            <a href="https://github.com/hellomouse/hellomouse-apps-api">Backend</a>
        </div>
    </v-container>
</template>

<script>
import { APPS } from '~/helpers/apps.js';

export default {
    data() { return { APPS }; }
}
</script>


<style lang="scss" scoped>
.title {
    color: rgb(var(--v-theme-on-surface));
    font-size: 3.5rem;
    letter-spacing: -0.05rem;
    font-weight: normal;
    opacity: 0.94;
}

.app-container {
    width: 390px;
    margin: 0 auto;
}

.bottom {
    margin-top: 160px;
    opacity: 0.8;
}
</style>
