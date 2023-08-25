import { defineStore } from 'pinia';

export const useBoardStore = defineStore({
    id: 'leftNav',
    persist: {
        // eslint-disable-next-line no-undef
        storage: persistedState.localStorage,
    },

    state: () => {
        return {
            boards: [],
            lastFetch: 0
        };
    },
});
