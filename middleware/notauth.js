import { useAuthStore } from "~/store/auth.js";

// eslint-disable-next-line no-undef
export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
        await new Promise(r => setTimeout(r, 2000));
        // eslint-disable-next-line no-undef
        return navigateTo('/');
    }
});
