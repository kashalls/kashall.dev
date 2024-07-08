<template>
    <div class="flex flex-col gap-2 p-1 w-64 text-xs font-normal whitespace-nowrap text-ellipsis">
        <div class="text-xs font-bold overflow-hidden">
            {{ ActivityType[filteredActivity[0].type] }} a game
        </div>
        <div class="flex flex-row">
            <div class="self-start relative">
                <img :src="dstnIcon" :alt="filteredActivity[0].name" class="rounded" />
            </div>
            <div class="ml-2.5">
                <div>
                    <div class="text-sm font-bold">{{ filteredActivity[0].name }}</div>
                    <div class="text-xs leading-4 font-normal">for <span>{{ formatFancyTime(timestamp - filteredActivity[0].timestamps?.start!) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const lanyard = useLanyard()

const { timestamp } = useTimestamp()
// Custom Emoji & Hang Status
const filteredActivity = computed(() => {
    return lanyard.value?.activities.filter((act) => ![4, 6].includes(act.type))
})

const dstnIcon = computed(() => {
    if (!filteredActivity.value?.length) return ''
    return `https://dcdn.dstn.to/app-icons/${filteredActivity.value[0].application_id}`
})
</script>