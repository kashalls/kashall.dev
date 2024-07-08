<template>
    <div class="flex-auto">
        <div class="text-xs leading-3 italic text-center">
            {{ genericStatus }}
        </div>
    </div>
</template>

<script setup lang="ts">
const lanyard = useLanyard()

const genericStatus = computed(() => {
    const status = lanyard.value?.discord_status
    if (status === 'dnd') {
        return "I\'m a little busy at the moment."
    } else if (status === 'idle') {
        return "I\'m idling near by, maybe I am available?"
    } else if (status === 'offline') {
        return "I'm offline at the moment, how strange."
    } else if (status === 'online') {
        return "I'm online, but what am I doing?"
    }
})
</script>