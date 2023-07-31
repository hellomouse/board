<template>
    <div class="container">
        <h1>Boards</h1>

        <ApiDoc
            title="Create Board"
            method="POST"
            endpoint="/api/board/boards"
            param-type="JSON"
            :auth="true"
        >
            Creates a new board for the currently logged in user (inferred from auth cookie).
            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>name: string</td><td>Name (title) of the board</td></tr>
                    <tr><td>desc: string</td><td>Description string of the board</td></tr>
                    <tr><td>color: string</td><td>Color of the board as a hex color <code>#RRGGBB</code></td></tr>
                    <tr>
                        <td>perms: object</td>
                        <td>
                            Permissions object in the format:<br><br>
                            <pre><code>{ user_id: {
    perm_level: 'perm level enum'
}, ...}</code></pre>
                            <br>
                            <NuxtLink to="/docs/users">See the users doc</NuxtLink> for more on permission enums. Typically
                            when creating a board this field is left blank. The owner permission is automatically assigned
                            for the creator.
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ id: "id of created board" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Edit Board"
            method="PUT"
            endpoint="/api/board/boards"
            param-type="JSON"
            :auth="true"
        >
            Update an existing board the currently logged in user has permissions to edit (inferred from auth cookie).<br><br>

            Calling this function will update the edited field for the board on success.

            If the current user only has the <code>Edit</code> permission, they cannot change the permission level
            of current owners & editors of the resource.

            Returns 401 if not logged in, 403 if board does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the board to edit</td></tr>
                    <tr><td>name: string?</td><td>Name (title) of the board</td></tr>
                    <tr><td>desc: string?</td><td>Description string of the board</td></tr>
                    <tr><td>color: string?</td><td>Color of the board as a hex color <code>#RRGGBB</code></td></tr>
                    <tr>
                        <td>perms: object?</td>
                        <td>
                            Permissions object in the format:<br><br>
                            <pre><code>{ user_id: {
    perm_level: 'perm level enum'
}, ...}</code></pre>
                            <br>
                            <NuxtLink to="/docs/users">See the users doc</NuxtLink> for more on permission enums. 
                            The owner permission is automatically assigned for the creator and cannot be removed.
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ id: "id of updated board" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Delete Board"
            method="DELETE"
            endpoint="/api/board/boards"
            param-type="JSON"
            :auth="true"
        >
            Delete an existing board the currently logged in user has permissions to delete (inferred from auth cookie).
            Anyone with the <code>Owner</code> permission can delete the board, even if they are not the creator.<br><br>

            Returns 401 if not logged in, 403 if board does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the board to delete</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Deleted" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Search Boards"
            method="GET"
            endpoint="/api/board/boards"
            param-type="URLParams"
            :auth="true"
        >
            Search for boards by parameters. Only boards the current user can access will be returned.

            TODO: updated

            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>offset: number? | 0</td><td>Offset to return results</td></tr>
                    <tr><td>limit: number? | 20</td><td>Max results to return, cannot exceed 100</td></tr>
                    <tr><td>not_self: boolean? | false</td><td>Return only boards that the user did not create</td></tr>
                    <tr><td>owner_search: string?</td><td>Filter boards by this owner ID</td></tr>
                    <tr><td>query: string?</td><td>Filter by board name and description (that include this query)</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ boards: [
    {
        name: "Name / title of board",
        id: "ID of the board",
        desc: "Description",
        creator: "User ID of creator",
        color: "Color of board, #RRGGBB",
        created: "Timestamp of creation, ie 2023-01-01T02:00:00.000000-04Z",
        edited: "Timestamp last modified",
        perms: {
            "logged_in_user_id": { perm_level: "Perm level enum" }
        }
    },
...]}</code></pre><br>

                Note that only permissions for the currently logged in user will be returned; to get 
                full board permissions you will need to query the single board endpoint.<br><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get a single board"
            method="GET"
            endpoint="/api/board/boards/single"
            param-type="URLParams"
            :auth="true"
        >
            Get a single board by ID. Returns 401 if not logged in or does not have permission
            to view the board, 403 if board does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the board</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    name: "Name / title of board",
    id: "ID of the board",
    desc: "Description",
    creator: "User ID of creator",
    color: "Color of board, #RRGGBB",
    created: "Timestamp of creation, ie 2023-01-01T02:00:00.000000-04Z",
    edited: "Timestamp last modified",
    perms: {
        "user_id": { perm_level: "Perm level enum" },
        ...
    }
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>