<template>
    <UiPanel title="Discord Status">
        <ActivitySpotify v-if="activity === 'spotify'" />
        <ActivityGame v-else-if="activity === 'game'" />
        <ActivityGeneric v-else />
    </UiPanel>
</template>

<script setup lang="ts">
const lanyard = useLanyard()

const activity = computed(() => {
    if (!lanyard.value) return 'generic'
    if (lanyard.value.listening_to_spotify) return 'spotify'
    if (lanyard.value.activities.length > 0) return 'game'
    else return 'generic'
})
</script>