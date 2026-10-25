<script setup lang="ts">
const { messages } = useSiteMessages()
</script>

<template>
    <!-- Sticky, so a reader scrolled down a page still sees one that appears. -->
    <UBanner v-if="messages.maintenance" icon="i-ph-wrench" color="warning"
        class="sticky top-0 z-20 rounded-md" :ui="{ container: 'h-auto min-h-12 py-2' }">
        <!-- The default title truncates, which cuts the message off on phones. -->
        <template #title>
            <span class="whitespace-normal">{{ messages.maintenance }}</span>
        </template>
    </UBanner>
</template>
