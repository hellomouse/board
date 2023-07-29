

<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" max-width="500" width="500">
            <v-card-text class="my-2 px-3">
                <h1 class="mb-4 mx-1 text-truncate">
                    Share "Title here"
                </h1>

                <v-autocomplete
                    v-model="select"
                    v-model:search="search"

                    rounded="0"
                    placeholder="Add people"
                    density="compact"

                    class="mt-2 mb-2"
                    style="height: 44px"
                    variant="solo-filled"
                    item-value="id"
                    item-title="name"
                    return-object
                    hide-details

                    :loading="searchLoading"
                    :items="items"
                >
                    <!-- TODO custom filter for saerching both name and id 
                    get perm levels from api as well -->
                    <template #item="{ props, item }">
                        <div
                            v-bind="props"
                        >
                            {{ item.value.name }}<br>@{{ item.value.id }}
                        </div>
                    </template>
                </v-autocomplete>

                <div class="user-list pa-2 mb-2">
                    <!-- TODO: make component -->
                    <div
                        class="[ user ] d-flex flex-row align-center"
                    >
                        <profile-picture class="mr-2" src="" />

                        <div class="d-flex flex-column justify-center">
                            <div class="user__name text-truncate">Public</div>
                            <div class="user__username text-truncate"><i>How anyone can access this resource</i></div>
                        </div>

                        <v-select
                            v-model="publicLevel"
                            class="user__perm"
                            :items="['View', 'Interact', 'Self Edit', 'Edit', 'No Access']"
                        ></v-select>
                    </div>
                </div>

                <div class="user-list pa-2">
                    <div
                        v-for="user in users" :key="user"
                        class="[ user ] d-flex flex-row align-center"
                    >
                        <profile-picture class="mr-2" :src="user.pfp_url" />

                        <div class="d-flex flex-column justify-center">
                            <div class="user__name text-truncate">{{ user.name }}</div>
                            <div class="user__username text-truncate">@{{ user.id }}</div>
                        </div>

                        <v-select
                            v-model="user.level"
                            class="user__perm"
                            :items="['View', 'Interact', 'Self Edit', 'Edit', 'Owner']"
                        ></v-select>

                        <v-btn variant="text" icon="mdi-close-circle" max-height="40"></v-btn>
                    </div>
                </div>

                <v-btn class="mt-4" variant="text">
                    <v-icon icon="mdi-link" /> &nbsp; Copy Link
                </v-btn>

                <div style="float: right" class="mt-4">
                    <v-btn
                        color="primary" variant="text"
                        @click="$emit('update', false)"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :loading="loading"
                        color="primary"
                        @click="$emit('update', true)"
                    >
                        Apply
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ShareModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        publicLevel: 'No Access',

        searchLoading: false,
        items: [],
        search: null,
        select: null,

        users: [
            {
                name: 'Bowserinator',
                id: 'bowserinator',
                pfp_url: 'https://i.imgur.com/X1WftFE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
                level: 'Owner'
            },
            {
                name: 'Bowserinator',
                id: 'bowserinator',
                pfp_url: 'https://i.imgur.com/X1WftFE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
                level: 'Edit'
            },
            {
                name: 'Bowserinator',
                id: 'bowserinator',
                pfp_url: 'https://i.imgur.com/X1WftFE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
                level: 'Edit'
            },
            {
                name: 'Bowserinator',
                id: 'bowserinator',
                pfp_url: 'https://i.imgur.com/X1WftFE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
                level: 'Edit'
            },
            {
                name: 'Bowserinator',
                id: 'bowserinator',
                pfp_url: 'https://i.imgur.com/X1WftFE_d.jpg?maxwidth=520&shape=thumb&fidelity=high',
                level: 'Edit'
            },
        ]
    }),
    computed: {
        showModal: {
            get() { return this.show; },
            set(val) { this.$emit('show', val); }
        }
    },

    watch: {
        search(val) {
            val !== this.select && this.querySelections(val);
        },
    },
    methods: {
        async querySelections(v) {
            if (v.length < 3) return;
            this.searchLoading = true;

            try {
                this.items = await this.$fetchApi("/api/users/search", "GET", { filter: v });
                this.items = this.items.users;
            } catch(e) {
                this.$emit('error', 'TODO'); // TODO
            }
            this.searchLoading = false 
        },
    },
}
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.user-list {
    border: 1px solid $border-color;
    overflow-y: auto;
    max-height: 300px;
}

.user {
    .user__username {
        opacity: $secondary-text-opacity;
        font-size: 0.9rem;
    }

    .user__name {
        font-size: 1rem;
    }

    .user__perm {
        max-width: 140px;
        transform: scale(0.7);
        transform-origin: right;
        margin-left: auto;
    }
}
</style>
