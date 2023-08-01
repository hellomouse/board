// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('formatTimestamp', t => {
        t = t.split('T');
        let time = t[1].split('.')[0];
        time = time.split(':').map(x => +x);
        time = `${time[0] > 12 ? time[0] - 12 : time[0]}:${time[1]} ${time[0] > 12 ? 'PM' : 'AM'}`;
        return `${t[0]} ${time}`;
    });
});
