<template>
    <div class="container">
        <h1>Tags</h1>

        <ApiDoc
            title="Create Tag"
            method="POST"
            endpoint="/api/board/tags"
            param-type="JSON"
            :auth="true"
        >
            Creates a new tag for the currently logged in user (inferred from auth cookie).
            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>name: string</td><td>Name (title) of the tag</td></tr>
                    <tr><td>color: string</td><td>Color as hex color <code>#RRGGBB</code>, <code>#FFFFFF</code> is code for "blank"</td></tr>
                    <tr><td>board_ids: uuid[]</td><td>UUIDs of the boards to be included in this tag</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Tag created" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Edit Tag"
            method="PUT"
            endpoint="/api/board/tags"
            param-type="JSON"
            :auth="true"
        >
            Update an existing tag the currently logged in user (inferred from auth cookie).<br><br>

            Returns 401 if not logged in, 403 if board does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: number</td><td>ID of the tag to edit</td></tr>
                    <tr><td>name: string?</td><td>Name (title) of the tag</td></tr>
                    <tr><td>color: string?</td><td>Color as hex color <code>#RRGGBB</code>, <code>#FFFFFF</code> is code for "blank"</td></tr>
                    <tr><td>board_ids: uuid[]?</td><td>UUIDs of the boards to be included in this tag</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Tag updated" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Add / Remove Boards from Tags"
            method="PUT"
            endpoint="/api/board/tags"
            param-type="JSON"
            :auth="true"
        >
            Add and delete multiple boards from a tag. Only tags the user created will be modified.

            Returns 401 if not logged in, and 500 on error. Still succeeds if any of the tags do not exist.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: number</td><td>ID of the tags to modify</td></tr>
                    <tr><td>board_ids_to_delete: uuid[]</td><td>IDs of the boards to delete from this tag, can be empty</td></tr>
                    <tr><td>board_ids_to_add: uuid[]</td><td>IDs of the boards to add to this tag, can be empty</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Tag updated" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Bulk edit tag colors"
            method="PUT"
            endpoint="/api/board/tags/bulk_colors"
            param-type="JSON"
            :auth="true"
        >
            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>tag_ids: number[]</td><td>IDs of the tags to modify. Limited to length 200, tags the user did not create are ignored</td></tr>
                    <tr><td>color: string</td><td>New color to assign as hex string</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Colors changed" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Delete Tags"
            method="DELETE"
            endpoint="/api/board/tags"
            param-type="JSON"
            :auth="true"
        >
            Delete multiple tags by ID. Only tags the user created will be deleted.

            Returns 401 if not logged in, and 500 on error. Still succeeds if any of the tags do not exist.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>ids: number[]</td><td>IDs of the tags to delete</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Tag deleted" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get all tags"
            method="GET"
            endpoint="/api/board/tags"
            param-type="URLParams"
            :auth="true"
        >
            Get all tags by the current user (Max 200). Takes no parameters.

            Returns 401 if not logged in, and 500 on error.<br><br>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ tags: [
    {
        name: "Name of the tag",
        id: number,
        color: "##RRGGBB",
        board_ids: Uuid[]
    },
...]}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get single tag"
            method="GET"
            endpoint="/api/board/tags/single"
            param-type="URLParams"
            :auth="true"
        >
            Get all tags by the current user (Max 200). Takes no parameters.

            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: number</td><td>ID of the tags to get</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ tag: { Same as get tags } }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>