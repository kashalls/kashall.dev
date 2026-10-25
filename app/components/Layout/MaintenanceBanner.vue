<script setup lang="ts">
const { messages } = useSiteMessages()
</script>

<template>
    <!-- Sticky, so a reader scrolled down a page still sees one that appears. -->
    <UBanner v-if="messages.maintenance" icon="i-ph-wrench" color="warning"
        :title="messages.maintenance" class="sticky top-0 z-20 rounded-md" />
</template>
