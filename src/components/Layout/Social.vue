<script setup lang="ts">
const socials = [{
    icon: 'i-ph-github-logo-fill',
    to: 'https://github.com/kashalls'
}, {
    icon: 'i-ph-discord-logo-fill',
    to: 'https://discordapp.com/users/201077739589992448'
}, {
    icon: 'i-ph-twitter-logo-fill',
    to: 'https://twitter.com/jordpjones'
}, {
    icon: 'i-ph-linkedin-logo-fill',
    to: 'https://www.linkedin.com/in/jordpjones/'
}]
</script>

<template>
    <div class="">
        <UButton v-for="social in socials" :key="social.to" :icon="social.icon" :to="social.to" size="xs" color="purple"
            square padded variant="ghost" />
    </div>


</template>