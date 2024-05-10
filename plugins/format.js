// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('formatTimestamp', t => {
        // Remove seconds
        t = new Date(t).toLocaleString().replace(/(\d+):(\d+):\d+/g, '$1:$2');
        return t;
    });

    nuxtApp.provide('formatStorage', x => {
        const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let l = 0;
        let n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l)
            n = n / 1024;
        return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    });
});
