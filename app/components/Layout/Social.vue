<script setup lang="ts">
const { openContact } = useContact()
</script>

<template>
    <div class="flex items-center gap-0.5">
        <UTooltip v-for="social in socials" :key="social.to" :text="social.label">
            <UButton :icon="social.icon" :to="social.to" target="_blank" :aria-label="social.label" size="sm"
                color="primary" variant="ghost" />
        </UTooltip>
        <UTooltip text="Email me">
            <UButton icon="i-ph-envelope-simple" aria-label="Email me" size="sm" color="primary" variant="ghost"
                @click="openContact()" />
        </UTooltip>
    </div>
</template>
