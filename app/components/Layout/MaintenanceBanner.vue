<script setup lang="ts">
const { data } = useSiteMessages()
</script>

<template>
    <UBanner v-if="data.messages.maintenance" icon="i-ph-wrench" color="warning"
        :title="data.messages.maintenance" class="rounded-md" />
</template>
