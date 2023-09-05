
<script setup>
// eslint-disable-next-line no-undef
definePageMeta({
    layout: false,
    middleware: 'auth'
});
</script>

<template>
    <NuxtLayout name="site">
        <div>
            <h1>Your Jobs</h1>
            <br>

            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">Job</th>
                        <th class="text-left">Created</th>
                        <th class="text-left">Finished</th>
                        <th class="text-left">URL</th>
                        <th class="text-left">Priority</th>
                        <th class="text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in jobs" :key="job.id">
                        <td>{{ job.name }}</td>
                        <td>{{ $formatTimestamp(job.created) }}</td>
                        <td>{{ job.finished !== job.created ? $formatTimestamp(job.finished) : '---' }}</td>
                        <td class="url-td text-truncate"><a :href="job.data.split('|').at(-1)">{{ job.data.split('|').at(-1) }}</a></td>
                        <td class="text-center">{{ job.priority }}</td>
                        <td>
                            <v-chip
                                :prepend-icon="getChipIcon(job.status)"
                                :color="getChipColor(job.status)"
                                label
                            >{{ job.status }}</v-chip>
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <div class="text-center mt-10">
                <h1>{{ stateMsg }}</h1>
            </div>
        </div>
    </NuxtLayout>
</template>

<script>
export default {
    data() {
        return {
            jobs: [],
            jobInterval: null,
            stateMsg: 'Loading...'
        };
    },
    mounted() {
        if (!this.jobInterval)
            this.jobInterval = setInterval(this.getJobs, 5000);
        this.getJobs();
    },
    destroyed() {
        if (this.jobInterval)
            clearInterval(this.jobInterval);
    },
    methods: {
        getChipIcon(status) {
            if (status === 'completed') return 'mdi-check-bold';
            if (status === 'errored') return 'mdi-alert-circle';
            if (status === 'processing') return 'mdi-dots-horizontal';
            return 'mdi-tray';
        },
        getChipColor(status) {
            if (status === 'completed') return 'green';
            if (status === 'errored') return 'red';
            if (status === 'processing') return 'yellow';
            return 'gray';
        },
        async getJobs() {
            try {
                let result = await this.$fetchApi('/api/site/status', 'GET', {
                    offset: 0,
                    limit: 100
                });
                this.jobs = result.jobs;
                this.stateMsg = this.jobs.length === 0 ? 'You have no queued jobs :D' : '';
            } catch(e) {
                console.error(e);
                this.stateMsg = 'Error loading jobs :(';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.url-td {
    max-width: 500px;
}
</style>
