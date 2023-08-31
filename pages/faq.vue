<template>
    <v-container style="max-width: 650px">
        <h1>FAQ</h1>

        <br>

        <h2>Account</h2>
        <ul class="ml-8 qa-list">
            <li>
                <b class="question">How do I register an account?</b>
                <p class="answer">
                    This site is intended to be used only for members of Hellomouse and friends.
                    Please contact an admin if you require an account.
                </p>
            </li>
            <li>
                <b class="question">How do I reset my password?</b>
                <p class="answer">
                    TODO
                </p>
            </li>
            <li>
                <b class="question">How do I delete my account?</b>
                <p class="answer">
                    That is not possible at this time.
                </p>
            </li>
        </ul>

        <br>
        <h2>Security</h2>
        <ul class="ml-8">
            <li>
                <b class="question">Is this secure?</b>
                <p class="answer">
                    We follow all standard security practices, but note admins can manually view all data in the database as
                    well as uploaded files.
                </p>
            </li>
        </ul>

        <br><hr><br>

        <h1>Privacy Statement</h1>
        
        <p>
            We (Hellomouse Apps) does not use any invasive tracking software.
            This does not cover tracking that may result
            from external embedded sites (such as Youtube videos).
        </p>

        <br><h3>What we collect</h3>
        <ul class="ml-8">
            <li>Account information, such as your account username and display name</li>
            <li>IP addresses and account login date/times (for security purposes, can be cleared in Settings)</li>
        </ul>

        <br><h3>What we don't collect</h3>
        <ul class="ml-8">
            <li>Personally identifiable browser or OS information</li>
        </ul>
        <br><br><br>
    </v-container>
</template>

<style scoped>
.qa-list li {
    margin-bottom: 8px;
}

.question {
    margin-bottom: 4px;
    display: block;
}
</style>