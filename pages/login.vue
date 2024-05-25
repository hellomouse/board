<template>
    <div class="container">
        <v-sheet elevation="4" class="login-container mt-16 px-10 mb-4">
            <h1>Sign In</h1>
            <p class="mb-4" style="font-size: 1.2rem">Hellomouse Apps Account</p>

            <p class="text-red mb-2">{{ error_msg }}&nbsp;</p>

            <v-text-field
                v-model="username" label="Username" density="compact"
                clearable variant="solo-filled" rounded="0"
                append-icon="mdi-account"
                class="mb-1"
            ></v-text-field>
            <!-- Max length should match server side -->
            <v-text-field
                v-model="password" label="Password" density="compact"
                clearable variant="solo-filled" rounded="0"
                :append-icon="!show_password ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_password ? 'text' : 'password'"
                :maxlength="32"
                class="mb-4"
                @click:append="show_password = !show_password"
                @keyup.enter="postLogin"
            ></v-text-field>

            <v-btn
                :loading="loading"
                color="primary"
                variant="flat"
                @click="postLogin"
            >login</v-btn>
        </v-sheet>
        <v-btn
            color="primary"
            variant="outlined"
            @click="loginWithKeycloak"
        >Sign in with Keycloak</v-btn>
        <p class="subtitle">Please contact an admin for sign-up</p>
    </div>
</template>

<script>
import { useBoardStore } from '~/store/boardStore.js';
import { useAuthStore } from '~/store/auth.js';

let keycloak;
export default {
    name: 'LoginPage',
    data: () => ({
        username: '',
        password: '',
        show_password: false,
        loading: false,
        error_msg: ''
    }),
    async mounted() {
        keycloak = this.$keycloak();
        let redirect = '/';
        if (this.$route.query && this.$route.query.r && this.$route.query.r.startsWith('/'))
            redirect = this.$route.query.r;

        keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: `${location.origin}/keycloak_silent_sso.html` })
        .then(async authenticated => {
        
            if (authenticated) {
                console.log("Authenticated");

                await this.$fetchApi('http://localhost:8080/v1/auth/callback', 
                    'POST',
                    { code: keycloak.token }
                );

                let authStore = useAuthStore(this.$pinia);
                
                try {
                    let user = await this.$fetchApi('http://localhost:8080/v1/users/keycloak', 'GET', { sub: keycloak.tokenParsed.sub });
                    authStore.login(user);
                } catch (e) {
                    this.error_msg = 'Failed to retrieve user information';
                    return;
                }

                useBoardStore(this.$pinia).lastFetch = 0;
                this.$router.push(redirect);
                
            }
            else 
                console.log("Not Authenticated");
        
        }).catch(e => {
            console.error(e);
        });
        
    },
    methods: {
        async postLogin() {
            let redirect = '/';
            if (this.$route.query && this.$route.query.r && this.$route.query.r.startsWith('/'))
                redirect = this.$route.query.r;

            this.loading = true;

            // Check username and password
            if (!this.username) {
                this.error_msg = 'Username cannot be empty';
                this.loading = false;
                return;
            }
            if (!this.password) {
                this.error_msg = 'Password cannot be empty';
                this.loading = false;
                return;
            }

            // Send login request
            let authStore = useAuthStore(this.$pinia);
            try {
                await this.$fetchApi('/api/login', 'POST', {
                    username: this.username,
                    password: this.password
                }, 30000);
            } catch(e) {
                if ((e + '').includes('401'))
                    this.error_msg = 'Incorrect username or password';
                else if ((e + '').includes('429'))
                    this.error_msg = 'Too many login attempts, try again later';
                else
                    this.error_msg = 'Error logging in';
                this.loading = false;
                return;
            }

            try {
                // Get user info
                let user = await this.$fetchApi('/api/users', 'GET', { id: this.username  });
                authStore.login(user);
            } catch (e) {
                this.error_msg = 'Failed to retrieve user information';
                this.loading = false;
                return;
            }

            useBoardStore(this.$pinia).lastFetch = 0; // Invalidate left nav board list
            this.loading = false;
            this.$router.push(redirect);
        },
        async loginWithKeycloak() {
            keycloak.login();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.container {
    margin: 0 auto;
    max-width: 450px;
    text-align: center;
}

.subtitle {
    opacity: var(--secondary-text-opacity);
}

.login-container {
    $padding: 100px;

    text-align: left;
    border: 1px solid var(--border-color);
    overflow: auto; // Clearfix
    background-color: rgba(255, 255, 255, 0.01);
    padding-top: calc($padding / 2);
    padding-bottom: $padding;

    .v-btn {
        height: 44px;
        display: block;
        margin-left: auto;
        margin-right: 36px;
        max-width: 140px;
        width: 100%;
        font-size: 1rem;
    }
}
</style>