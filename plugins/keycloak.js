import { defineNuxtPlugin } from '#app';
import Keycloak from 'keycloak-js';

export default defineNuxtPlugin(nuxtApp => {
  let keycloak;

  function initKeycloak() {
    const { $config } = nuxtApp;
    keycloak = new Keycloak({
      url: $config.public.keycloakAuthUrl,
      realm: $config.public.keycloakRealm,
      clientId: $config.public.keycloakClientId
    });
    return keycloak;
  }

  function getKeycloak() {
    if (!keycloak) {
      keycloak = initKeycloak();
    }
    return keycloak;
  }

  nuxtApp.provide('keycloak', getKeycloak);
});
