import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
    id: 'auth',
    persist: true,

    state: () => {
        return {
            _user: {},
            _is_logged_in: false
        };
    },

    actions: {
        login(user) {
            this._user = user;
            this._is_logged_in = true;
        },

        logout() {
            this._user = {};
            this._is_logged_in = false;
        }
    },

    getters: {
        user() { return this._user; },
        isLoggedIn() { return this._is_logged_in; }
    },
});
