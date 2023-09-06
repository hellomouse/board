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

            Returns 401 if not logged in, and 500 on error. Still succeeds if board does not exist.<br>

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

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
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
                    <tr><td>sort_by: Name | Created | Edited</td><td>Sort for searching in DB</td></tr>
                    <tr><td>sort_down: bool | true</td><td>Sort down (ABC) or up (ZYX)</td></tr>
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
        },
        pin_count: number of pins (int)
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
    },
    pin_count: number of pins (int)
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Bulk edit board colors"
            method="PUT"
            endpoint="/api/board/boards/bulk_colors"
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
                    <tr><td>board_ids: array of strings</td><td>IDs of the boards to modify. Limited to length 200, boards the user cannot edit are ignored</td></tr>
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
            title="Bulk get board perms"
            method="POST"
            endpoint="/api/board/boards/perms/bulk"
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
                    <tr><td>board_ids: array of strings</td><td>IDs of the boards to modify. Limited to length 200, boards the user cannot edit are ignored</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    perms: {
        username (string): {
            name: display name (string),
            perm: { perm_level: string }
        }
    } 
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Bulk modify board perms"
            method="PUT"
            endpoint="/api/board/boards/perms/bulk"
            param-type="JSON"
            :auth="true"
        >
            Modify permissions across all provided boards at once. Invalid rules will be ignored; invalid rules are:
            <ul class="ml-10">
                <li>If the user has edit permission, they cannot edit / remove permissions of other users with edit or owner permission</li>
                <li>The creator of the board will always be owner</li>
                <li>Users with edit permission cannot create / modify permissions to owner</li>
                <li>The user id must exist</li>
            </ul>
            <br>
            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>board_ids: array of strings</td><td>IDs of the boards to modify. Limited to length 200, boards the user cannot edit are ignored</td></tr>
                    <tr><td>perms_to_add: { username: { perm_level: perm (string) } }</td><td>New or modified user permissions as an object of user ID : perm object. New users will be inserted and existing permissions updated; ignores invalid rules</td></tr>
                    <tr><td>users_to_delete: array of strings</td><td>IDs of the users to remove from all boards; ignores invalid rules</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ updated: number of boards updated }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>