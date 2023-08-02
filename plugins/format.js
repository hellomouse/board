// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('formatTimestamp', t => {
        t = new Date(t).toLocaleString();
        return t;
    });
});
