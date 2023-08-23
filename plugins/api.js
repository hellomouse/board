// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    AbortSignal.timeout??= function timeout(ms) {
        const ctrl = new AbortController()
        setTimeout(() => ctrl.abort(), ms)
        return ctrl.signal
    }

    nuxtApp.provide('fetchApi', async (url, method, body) => {
        let requestOptions = {
            method: method,
            mode: 'cors',
            connection: 'close',
            credentials: 'include',
            signal: AbortSignal.timeout(10000)
        };
        if (method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
            requestOptions.headers = { 'Content-Type': 'application/json' };
        } else if (method === 'GET' && body)
            url += '?' + new URLSearchParams(body);

        // eslint-disable-next-line no-undef
        return await $fetch(url, requestOptions);
    });

    nuxtApp.provide('apiErrorToString', e => {
        e = e + '';
        if (e.includes('The user aborted a request'))
            return 'Request timeout';
        if (e.includes('400 Bad Request'))
            return 'Malformed request';
        if (e.includes('401 '))
            return 'Action unauthorized';
        if (e.includes('403 '))
            return 'Invalid parameters';
        if (e.includes('500 '))
            return 'Server error';
        return 'Unknown error';
    });
});
