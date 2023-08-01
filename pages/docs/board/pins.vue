<template>
    <div class="container">
        <h1>Pins</h1>

        <ApiEnum
            title="Pin Type Enum"
            desc="Determines the type of the pin. Has both string and numeric values. You should pass a
            number when setting. The API will return a string variant, ie 'Markdown'"
            :enums="[
                ['Markdown = 0', 'A simple markdown note'],
                ['ImageGallery = 1', 'A gallery of images in attachment_paths'],
                ['Link = 2', 'Content contains a single URL, which is previewed'],
                ['Review = 3', 'Content is markdown, but has a component for other users to interact (leave a review)']
            ]"
        />

        <ApiEnum
            title="Pin Flags"
            desc="Bitwise flags that determine additional properties of the pin. Has both string and numeric values. You should pass a
            number when setting. The API will return a string variant, ie 'LOCKED | PINNED'."
            :enums="[
                ['LOCKED = 1', 'Pin cannot be edited and can only be unlocked by owner or creator'],
                ['ARCHIVED = 2', 'Pin is sorted lower in priority'],
                ['PINNED = 4', 'Pin is sorted higher in priority']
            ]"
        />


        <ApiDoc
            title="Create Pin"
            method="POST"
            endpoint="/api/board/pins"
            param-type="JSON"
            :auth="true"
        >
            Creates a new pin for a board for the currently logged in user (inferred from auth cookie).
            Returns 401 if not logged in, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>pin_type: Pin type enum (numeric)</td><td>Type of the pin as a number</td></tr>
                    <tr><td>flags: number</td><td>Bit flags for the pin</td></tr>
                    <tr><td>board_id: string</td><td>Board the pin belongs to, the user must have permission to create a pin</td></tr>
                    <tr><td>content: string</td><td>Raw internal content of the pin</td></tr>
                    <tr><td>attachment_paths: string[]</td><td>Paths to any files attached to the pin</td></tr>
                    <tr><td>metadata: json</td><td>Any additional JSON data to attach to the pin</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ id: "id of created pin" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Edit Pin"
            method="PUT"
            endpoint="/api/board/pins"
            param-type="JSON"
            :auth="true"
        >
            Update an existing pin the currently logged in user has permissions to edit (inferred from auth cookie).<br><br>

            Users can only edit a pin if they have the "Edit" or "Owner" permission on the parent board, or have the "SelfEdit" 
            permission and are the creator of the current pin.<br><br>

            Calling this function will update the edited field for the pin on success.

            Returns 401 if not logged in, 403 if pin does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the pin to edit</td></tr>
                    <tr><td>pin_type: Pin type enum (numeric)?</td><td>Type of the pin as a number</td></tr>
                    <tr><td>flags: number?</td><td>Bit flags for the pin</td></tr>
                    <tr><td>board_id: string?</td><td>Board the pin belongs to, the user must have permission to create a pin</td></tr>
                    <tr><td>content: string?</td><td>Raw internal content of the pin</td></tr>
                    <tr><td>attachment_paths: string[]?</td><td>Paths to any files attached to the pin</td></tr>
                    <tr><td>metadata: json?</td><td>Any additional JSON data to attach to the pin</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ id: "id of updated pin" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Delete Pin"
            method="DELETE"
            endpoint="/api/board/pins"
            param-type="JSON"
            :auth="true"
        >
            Delete an existing pin the currently logged in user has permissions to delete (inferred from auth cookie).
            Users can only delete a pin if they have the "Edit" or "Owner" permission on the parent board, or have the "SelfEdit" 
            permission and are the creator of the current pin.<br><br>

            Returns 401 if not logged in, and 500 on error. Still succeeds if pin does not exist.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the pin to delete</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ msg: "Deleted" }</code></pre><br>
                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Search Pins"
            method="GET"
            endpoint="/api/board/pins"
            param-type="URLParams"
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
                    <tr><td>board_id: string?</td><td>ID of the parent board of the pin</td></tr>
                    <tr><td>offset: number?</td><td>Search offset, default 0</td></tr>
                    <tr><td>limit: number?</td><td>Pins returned, max 100, default 20</td></tr>
                    <tr><td>creator: string?</td><td>Creator user ID of the pin</td></tr>
                    <tr><td>query: string?</td><td>Pin content string contains this string</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    pins: [
        { see "Get a single pin" for properties },
        ...
    ]
}</code></pre><br>
                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc
            title="Get a single pin"
            method="GET"
            endpoint="/api/board/pins/single"
            param-type="URLParams"
            :auth="true"
        >
            Returns 401 if not logged in, 403 if pin does not exist, and 500 on error.<br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>id: string</td><td>ID of the pin to get</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{
    board_id: "ID of parent board",
    pin_id: "ID of pin",
    pin_type: "Enum string pin_type",
    content: "Pin content",
    creator: "Pin creator user ID",
    created: "Timestamp of creation, ie 2023-01-01T02:00:00.000000-04Z",
    edited: "Last modified timestamp"
    flags: "Pin flags, separated by |, ie PINNED | LOCKED"
    attachment_paths: [ "path to attachment" ],
    metadata: { ... }
}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 403 Forbidden, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>