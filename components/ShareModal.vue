<!--
A generic share resource modal
It's recommend to wrap this for each resource

Example usage:

<ShareModal
    :show="shareBoardModal"
    :perma-share-link="shareBoardLink"
    :creator="shareBoardCreator"
    :resource-name="shareBoardName"
    :perm-levels="['View', 'Interact', 'Self Edit', 'Edit', 'Owner']"
    :initial-users="shareUsers"
    :initial-public-perm="sharePublicPerm"
    :share-board-modal-loading="shareBoardModalLoading"

    @update="newPerms => {} or { user: { perm_level: ... }}"
    @error="e => ..."
    @success="e => ..."
/>
-->

<template>
    <v-dialog
        v-model="showModal"
        width="auto"
    >
        <v-card rounded="0" width="500">
            <v-card-text class="my-2 px-3">
                <h1 class="mb-2 mx-1 text-truncate">
                    Share "{{ resourceName }}"
                </h1>

                <div class="d-flex flex-row align-center">
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
                        :custom-filter="(_, query, item) => {
                            query = query.toLowerCase();
                            return item.value.id.toLowerCase().includes(query) || item.value.name.toLowerCase().includes(query);
                        }"
                        item-title="name"
                        return-object
                        hide-details chips closable-chips

                        multiple
                        :loading="searchLoading"
                        :items="items"
                        @keyup.enter="addNewUsers"
                    >
                        <template #chip="{ props, item }">
                            <v-chip
                                v-bind="props"
                                :prepend-avatar="item.value.pfp_url"
                                :text="item.value.name"
                            ></v-chip>
                        </template>
                    
                        <template #item="{ props, item }">
                            <div
                                v-bind="props" class="[ user ] d-flex flex-row mx-2 align-center"
                                style="cursor: pointer"
                                @click="search = ''"
                            >
                                <profile-picture
                                    class="mr-2"
                                    size="30px" :src="item.value.pfp_url"
                                />
                                <div class="d-flex flex-column justify-center">
                                    <div class="user__name text-truncate">{{ item.value.name }}</div>
                                    <div class="user__username text-truncate">@{{ item.value.id }}</div>
                                </div>
                            </div>
                        </template>
                    </v-autocomplete>

                    <v-btn
                        class="ml-2" color="primary"
                        style="height: 42px"
                        @click="addNewUsers"
                    >Add</v-btn>
                </div>

                <!-- Share with public -->
                <div class="user-list pa-2 mb-2">
                    <div
                        class="[ user ] d-flex flex-row align-center"
                    >
                        <profile-picture class="mr-2" src="" />
                        <div class="d-flex flex-column justify-center">
                            <div class="user__name text-truncate">Public</div>
                            <div class="user__username text-truncate"><i>How anyone can access this resource</i></div>
                        </div>

                        <v-select
                            v-model="publicLevel" class="user__perm"
                            :items="permLevels.filter(x => x !== 'Owner').concat([NO_ACCESS])"
                        ></v-select>
                    </div>
                </div>

                <!-- User share list -->
                <div class="user-list pa-2" style="min-height: 150px;">
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
                            :disabled="user.id === creator"
                            class="user__perm mr-2"
                            :items="permLevels"
                        ></v-select>

                        <v-btn
                            :disabled="user.id === creator"
                            variant="text" icon="mdi-close-circle" max-height="40"
                            @click="removeUser(user.id)"
                        ></v-btn>
                    </div>
                </div>

                <!-- Bottom portion -->
                <v-btn
                    class="mt-4" variant="text"
                    @click="copyShareLink"
                >
                    <v-icon icon="mdi-link" /> &nbsp; Copy Link
                </v-btn>

                <div style="float: right" class="mt-4">
                    <v-btn
                        color="primary" variant="text"
                        @click="$emit('update', {})"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        :loading="loading"
                        color="primary"
                        @click="emitNewPerms"
                    >
                        Apply
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
const NO_ACCESS = 'No Access';

export default {
    name: 'ShareModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false,
        },
        // Creator's permissions cannot be modified
        creator: {
            type: String,
            required: true
        },
        // For title
        resourceName: {
            type: String,
            required: true
        },
        permaShareLink: {
            type: String,
            required: true
        },
        // Array of perm levels, from least to most permissive
        // First item will be the default for newly added users
        permLevels: {
            type: Array,
            required: true
        },
        // Array of users with { id, name, pfp_url, level }
        initialUsers: {
            type: Array,
            required: true,
            validator(val) {
                return val.every(x => ['id', 'name', 'pfp_url', 'level']
                    .every(prop => Object.keys(x).includes(prop)));
            }
        },
        // Initial public permission, must be in perm levels
        initialPublicPerm: {
            type: String,
            default: NO_ACCESS
        },
    },
    data: () => ({
        NO_ACCESS,
        publicLevel: NO_ACCESS,

        // Autocomplete:
        searchLoading: false, // User search loading
        items: [],            // Store temp user search
        search: null,         // User search input text
        select: null,         // List of user objects selected in user search
        users: []
    }),
    computed: {
        showModal: {
            get() { return this.show; },
            set(val) { this.$emit('show', val); }
        }
    },
    watch: {
        // Update autocomplete data
        search(val) {
            val !== this.select && this.querySelections(val);
        },
        // Set initial users + public perm
        initialUsers(val) { this.users = val; },
        initialPublicPerm(val) { this.publicLevel = val || NO_ACCESS; }
    },
    methods: {
        // Update user autocomplete
        async querySelections(v) {
            if (v.length < 2) {
                this.items = [];
                return;
            }
            this.searchLoading = true;

            try {
                // TODO: rate limit
                this.items = await this.$fetchApi('/api/users/search', 'GET', { filter: v });
                this.items = this.items.users;
            } catch(e) {
                this.$emit('error', 'Error getting users: ' + this.$apiErrorToString(e));
            }
            this.searchLoading = false 
        },
        // Called when "Add button" or ENTER is pressed in the auto complete
        async addNewUsers() {
            // Add valid user from enter
            if (this.search) {
                let ids = this.search.toLowerCase().split(',').map(x => x.trim());
                let existingUsers = this.users.map(u => u.id);
                let toAdd = [];
                ids = ids.filter(id => !existingUsers.includes(id)); // Remove duplicates
                
                try {
                    toAdd = await this.$fetchApi('/api/users/batch', 'GET', { ids: ids.join(',') });
                    toAdd = toAdd.users;
                } catch (e) {
                    this.$emit('error', 'Error getting users: ' + this.$apiErrorToString(e));
                    return;
                }
                this.select = this.select ? this.select.concat(toAdd) : toAdd;
            }

            if (this.select) {
                this.select.forEach(u => u.level = this.permLevels[0]);

                // Remove duplicates
                let existingIds = this.users.map(u => u.id);
                this.select = this.select.filter(u => !existingIds.includes(u.id));
            }
            this.users = this.users.concat(this.select || []);
            this.select = null;
            this.search = '';
            this.items = [];
        },

        // Remove a user from the current perm list
        removeUser(id) {
            this.users = this.users.filter(user => user.id !== id);
        },
        // Copy the perma share link to clipboard
        copyShareLink() {
            navigator.clipboard.writeText(this.permaShareLink);
            this.$emit('success', 'Link copied!');
        },
        // User finalized new perms
        emitNewPerms() {
            let newPerms = {};
            for (let user of this.users)
                newPerms[user.id] = { perm_level: user.level };
            if (this.publicLevel !== NO_ACCESS)
                newPerms['public'] = { perm_level: this.publicLevel };
            this.$emit('update', newPerms);
        }
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
    &__username {
        opacity: $secondary-text-opacity;
        font-size: 0.9rem;
    }

    &__name {
        font-size: 1rem;
    }

    &__perm {
        min-width: 140px;
        max-width: 140px;
        transform: scale(0.7);
        transform-origin: right;
        margin-left: auto;
    }
}
</style>
