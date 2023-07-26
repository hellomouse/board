<template>
    <div class="navbar" fixed>
        <UiAppLogo /> <!-- TODO: pass icon path from layout -->

        <v-text-field
            label="" rounded="0"
            placeholder="Search"
            flat variant="solo-filled"
        ></v-text-field>  <!-- TODO prepend icon -->

        <div class="navbar__links">
            <v-menu>
                <template #activator="{ props }">
                    <button class="image-button mx-2" v-bind="props"></button>
                </template>
                <div>
                    <v-sheet
                        elevation="6"
                        width="200"
                        class="popout-sheet"
                    >
                        TODO
                    </v-sheet>
                </div>
            </v-menu>

            <v-menu>
                <template #activator="{ props }">
                    <button class="image-button mx-2" v-bind="props"></button>
                </template>
                <div>
                    <v-sheet
                        elevation="6"
                        width="200"
                        class="popout-sheet"
                    >
                        <div class="py-2 px-4">
                            <!-- TODO pfp pic -->
                            <b>Username</b><br>
                            <small>@Username</small>
                        </div>
                        <!-- TODO icons -->
                        <button class="py-3 px-4">Settings</button><br>
                        <button class="py-3 px-4">Logout</button><br>
                        <div class="py-2 px-4">
                            <small>FAQ / Info</small>
                        </div>
                    </v-sheet>
                </div>
            </v-menu>
        </div>
    </div>
</template>

<style lang="scss">
$height: 64px;

.image-button {
    border-radius: 50%;
    background: red;
    height: 70%;
    aspect-ratio: 1 / 1; 
}

$popout-arrow-size: 10px;
$popout-arrow-gap: 5px;

.popout-sheet {
    border-radius: 0 !important;
    margin-top: $popout-arrow-size + $popout-arrow-gap;

    &:after {
        position: absolute;
        top: -$popout-arrow-size + $popout-arrow-gap;
        height: 0;
        width: 0;
        left: calc(100% - 35px); // TODO: calculate bsaed on image size
        border: $popout-arrow-size solid transparent;
        border-bottom-color: #333;
        content: '';
    }

    // TODO: abstract highlight to global highlightable or something
    & > button:first-of-type {
        border-top: 1px solid #333; // TODO
    }

    & > button {
        width: 100%;
        border-radius: 0;
        border: none;
        outline: none;

        text-align: left;
        border-bottom: 1px solid #333; // TODO
    }
}

.navbar {
    height: $height;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 20px;

    // Stick to top
    position: sticky;
    top: 0;
    z-index: 999;

    &__logo {
        height: $height;
        background-color: inherit;
    }

    &__links {
        background-color: transparent;
        display: flex;
        flex-direction: row;
        min-width: 200px;
        justify-content: right;
        align-items: center;

        line-height: 100%;
        height: 100%;
    }
}
</style>