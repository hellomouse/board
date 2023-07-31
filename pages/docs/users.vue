<template>
    <div class="container">
        <h1>Users and Authentication</h1><br>

        <ApiDoc
            title="Login"
            method="POST"
            endpoint="/api/login"
            param-type="JSON"
            :auth="false"
        >
            This endpoint authenticates a user.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>username: string</td>
                        <td>User ID to login with</td>
                    </tr>
                    <tr>
                        <td>password: string</td>
                        <td>Password of the user</td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                On success <code>(200)</code> returns a Set-Cookie header (http-only). This cookie should be included in future requests
                that require authentication.
                On invalid login (incorrect username or password) returns <code>401</code>.
            </p>
            <br>
            <p>
                <b>Success:</b> 200 OK, Set-Cookie<br>
                <pre class="api-json-block"><code>{ msg: "You logged in" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Logout"
            method="POST"
            endpoint="/api/logout"
            param-type="JSON"
            :auth="false"
        >
            This endpoint logs a user out (invalidates session) and takes no parameters.

            <p>
                Endpoint will always succeed, even if the user is not logged in (in which case it does nothing)
            </p>
            <br>
            <p>
                <b>Success:</b> 200 OK, Set-Cookie<br>
                <pre class="api-json-block"><code>{ msg: "You logged out" }</code></pre><br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Update User Settings"
            method="PUT"
            endpoint="/api/user_settings"
            param-type="JSON"
            :auth="true"
        >
            Changes the settings for the current user. On failure returns 500.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>settings: json</td>
                        <td>
                            New settings JSON for the user. The old JSON will be overwritten, extraneous keys will be deleted, and
                            missing keys will be replaced with default values.
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK<br>
                <pre class="api-json-block"><code>{ msg: "Settings updated" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Search for users"
            method="GET"
            endpoint="/api/users/search"
            param-type="URLParams"
            :auth="true"
        >
            Search for users by filter string. Up to 20 users can be returned.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>filter: string</td>
                        <td>
                            Filter string, must be at least 2 characters long. Results will search user IDs
                            that have this string as a prefix, or a user display name that contains this string.
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ users: [{
    id: 'user id',
    name: 'display name',
    pfp_url: 'url to profile picture, or empty string'
}, ...] }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
        
        <ApiDoc
            title="Get info for a single user"
            method="GET"
            endpoint="/api/users"
            param-type="URLParams"
            :auth="true"
        >
            Get user info by ID. If the user does not exist, 403 will be returned.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>id: string</td>
                        <td>
                            User ID
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    id: 'user id',
    name: 'display name',
    pfp_url: 'url to profile picture, or empty string'
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get info for multiple users (batch call)"
            method="GET"
            endpoint="/api/users/batch"
            param-type="URLParams"
            :auth="true"
        >
            Get user info by ID for multiple users at a time. Non-existent users will be skipped.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ids: string</td>
                        <td>
                            Comma separated string of user IDs (no spaces)
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ users: [{
    id: 'user id',
    name: 'display name',
    pfp_url: 'url to profile picture, or empty string'
}, ...] }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get user settings"
            method="GET"
            endpoint="/api/user_settings"
            param-type="URLParams"
            :auth="true"
        >
            Get user settings JSON of the currently logged in user (inferred from auth cookie).
            Returns 500 on error.<br><br>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ [Keys are whatever are in the user JSON] }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>