import { useAuthStore } from "~/store/auth.js";

// eslint-disable-next-line no-undef
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn)
        // eslint-disable-next-line no-undef
        return navigateTo('/');
});
