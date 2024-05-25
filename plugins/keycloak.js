import { defineNuxtPlugin } from '#app'
import Keycloak from 'keycloak-js';

export default defineNuxtPlugin(nuxtApp => {
  if (!process.client) return;

  const config = useRuntimeConfig();
  const keycloak = new Keycloak({
    url: config.public.keycloakAuthUrl,
    realm: config.public.keycloakRealm,
    clientId: config.public.keycloakClientId,
  });

  async function initKeycloak() {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/keycloak_silent_sso.html',
        pkceMethod: 'S256',
      });
      keycloak.onTokenExpired = () => {
        keycloak.updateToken(30)
      };
      console.log(authenticated ? 'Authenticated' : 'Not authenticated');
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
    }
  }

  nuxtApp.provide('keycloak', keycloak);
  nuxtApp.provide('initKeycloak', initKeycloak);

  nuxtApp.hook('app:mounted', initKeycloak);
});
