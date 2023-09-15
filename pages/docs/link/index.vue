<template>
    <div class="container">
        <h1>Link</h1>

        <ApiDoc
            title="Add Link"
            method="POST"
            endpoint="/api/link"
            param-type="JSON"
            :auth="true"
        >
            Add a new link for the current logged in user.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>url: string</td><td>URL to add</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ id: number, id of the newly added link }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Delete Link"
            method="DELETE"
            endpoint="/api/link"
            param-type="JSON"
            :auth="true"
        >
            Delete a link for the current logged in user. If the specified ID does not
            belong to the current user nothing will happen.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: number</td><td>ID of link to delete</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Link removed" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get links for user"
            method="GET"
            endpoint="/api/link"
            param-type="URLParams"
        >
            Get all links for the specified user

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>user_id: string</td><td>User ID to get links for.</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    creator_name: "Display name for user_id",
    links: [{
        url: "string",
        id: number
    }, ...]
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>