<template>
    <div class="container">
        <h1>Site</h1>

        <ApiDoc title="Upload File" method="POST" endpoint="/api/files" param-type="Multipart" :auth="true">
            Upload (multiple) files as in a file upload webform. The body should be the raw multipart data. At most 50
            files can be uploaded at a time.

            <p>
            <pre class="api-json-block"><code>{
    msg: "File upload result",
    succeeded: ["id of uploaded files", ...],
    failed: [index in array of files that failed]
}</code></pre><br>

            <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>

        <ApiDoc title="Get file by id" method="GET" endpoint="/api/files/single" param-type="URLParams">
            Get a file by id.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>id: uuid</td>
                        <td>Id of the file to get</td>
                    </tr>
                </tbody>
            </v-table>

            <p><b>Success:</b> 200 OK. The file is directly served.</p>
            <b>Error:</b> 500 Server error<br>
        </ApiDoc>

        <ApiDoc title="Delete file by id" method="DELETE" endpoint="/api/files/single" param-type="URLParams" :auth="true">
            Delete a file by id. You can only delete files you uploaded.

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>id: uuid</td>
                        <td>Id of the file to delete</td>
                    </tr>
                </tbody>
            </v-table>

            <p><b>Success:</b> 200 OK. The file is deleted.</p>
            <b>Error:</b> 500 Server error<br>
        </ApiDoc>

        <ApiDoc
            title="Get (own) files"
            method="GET"
            endpoint="/api/files"
            param-type="URLParams"
            :auth="true"
        >
            List files uploaded by the current user.

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
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>[{
    id: Uuid,
    file_name: String,
    file_extension: String
}, ...]</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>