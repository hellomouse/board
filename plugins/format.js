// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('formatTimestamp', t => {
        // Remove seconds
        t = new Date(t).toLocaleString().replace(/(\d+):(\d+):\d+/g, '$1:$2');
        return t;
    });
});
