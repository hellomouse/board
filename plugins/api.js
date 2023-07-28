// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('fetchApi', async (url, method, body) => {
        let requestOptions = {
            method: method,
            mode: 'cors',
            credentials: 'include'
        };
        if (method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
            requestOptions.headers = { 'Content-Type': 'application/json' };
        } else if (body)
            url += '?' + new URLSearchParams(body);

        // eslint-disable-next-line no-undef
        return await $fetch(url, requestOptions);
    });
});
