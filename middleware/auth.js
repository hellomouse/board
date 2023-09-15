import { useAuthStore } from "~/store/auth.js";

// eslint-disable-next-line no-undef
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn && to.path !== '/login') {
        let query = to.query ? ('?' + new URLSearchParams(to.query).toString()) : '';

        // eslint-disable-next-line no-undef
        return navigateTo('/login?r=' + to.path + query);
    }
});
