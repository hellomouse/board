<template>
    <div class="container">
        <h1>Site</h1>

        <ApiDoc
            title="Queue Website Download"
            method="POST"
            endpoint="/api/site/download"
            param-type="JSON"
            :auth="true"
        >
            Queue a website download. The output will be stored at <code>/files/site_downloads/[task id].[html|pdf]</code><br>

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>strategy: pdf|html|media</td><td>Download strategy. PDF is download as PDF, HTML as HTML file, and media is same as HTML except for certain sites, which will have special hard-coded rules.</td></tr>
                    <tr><td>url: string</td><td>URL to generate the preview for</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ uuid: "UUID of the task, use this to access output file" }</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>