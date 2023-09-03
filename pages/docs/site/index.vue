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

        <ApiDoc
            title="Get status of jobs"
            method="GET"
            endpoint="/api/site/status"
            param-type="URLParams"
            :auth="true"
        >
            Get status of all download tasks for the currently logged in user

            <v-table density="compact" class="api-parameter-table my-4">
                <thead>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class="text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>offset: 0?</td><td>Offset to get.</td></tr>
                    <tr><td>limit: 100?</td><td>Limit of jobs to get, at most 100</td></tr>
                </tbody>
            </v-table>

            <p>
                <b>Success:</b> 200 OK
                <pre class="api-json-block"><code>{ jobs: [{
    id: uuid of job,
    created: date created,
    finished: date completed, or same as created if not finished,
    name: command, ie "preview_pin",
    data: data string passed to command,
    requestor: id of user who initiated the task,
    priority: priority of task, bigger number = higher,
    status: status, "completed|errored|processing|queued"
}, ...]}</code></pre><br>

                <b>Error:</b> 401 Unauthorized, 500 Server error<br>
            </p>
        </ApiDoc>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/css/api-docs.scss";
</style>