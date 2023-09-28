import { defineStore } from 'pinia';

export const useMusicStore = defineStore({
    id: 'musicStore',
    persist: {
        // eslint-disable-next-line no-undef
        storage: persistedState.localStorage,
    },

    state: () => {
        return {
            playlists: [],
            lastFetch: 0
        };
    },
});
