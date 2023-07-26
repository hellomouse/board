import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import colors from 'vuetify/lib/util/colors';

// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        treeShake: true,

        theme: {
            defaultTheme: "dark",
            themes: {
                dark: {
                    dark: true,
                    colors: {
                        primary: colors.blue.darken2,
                        accent: colors.grey.darken3,
                        secondary: colors.amber.darken3,
                        info: colors.teal.lighten1,
                        warning: colors.amber.base,
                        error: colors.deepOrange.accent4,
                        success: colors.green.accent3,
                        background: '#0D0D0D',
                        surface: '#1A1A1A'
                    }
                },
            },
        }
    });

    nuxtApp.vueApp.use(vuetify);
});
