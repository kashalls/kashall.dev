<script setup lang="ts">
import type { LanyardData } from '~/types/lanyard';

const LanyardStatus = ref<LanyardData>()
const { $lanyard } = useNuxtApp()

const heartbeatInterval = ref()
const currentTime = ref<number>(Date.now())

onMounted(async () => {
    if (!import.meta.browser) return;

    heartbeatInterval.value = setInterval(() => {
        currentTime.value = Date.now()
    }, 1000)

    const lanyard = await $lanyard({
        userId: '201077739589992448',
        socket: true,
    })

    lanyard.addEventListener('message', ({ data }) => {
        const { d } = JSON.parse(data)
        if (!d.heartbeat_interval) {
            LanyardStatus.value = d
        }
    })
})

onBeforeUnmount(() => {
    clearInterval(heartbeatInterval.value)
})

const firstActivity = computed(() => {
    return LanyardStatus.value?.activities.filter((activity) => activity.id !== 'custom' && activity.type !== 6)[0]
})

const bubble = computed(() => {
    const spotify = LanyardStatus.value?.listening_to_spotify
    const firstIcon = firstActivity.value?.assets ? `${firstActivity.value?.application_id}/${firstActivity.value.assets.large_image ?? firstActivity.value.assets.small_image}` : `https://dcdn.dstn.to/app-icons/${firstActivity.value?.application_id}`

    return {
        title: spotify ? LanyardStatus.value?.spotify?.song : firstActivity.value?.name,
        subtitle: spotify ? `by ${LanyardStatus.value?.spotify?.artist}` : firstActivity.value?.details,
        subsubtitle: spotify ? `on ${LanyardStatus.value?.spotify?.album}` : firstActivity.value?.state,
        icon: spotify ? LanyardStatus.value?.spotify?.album_art_url : firstIcon,
        to: spotify ? `https://open.spotify.com/track/${LanyardStatus.value?.spotify?.track_id}` : null,
        timestamps: spotify ? LanyardStatus.value?.spotify?.timestamps : firstActivity.value?.timestamps
    }
})

const timing = computed(() => {
    const elapsed = currentTime.value - LanyardStatus.value?.spotify?.timestamps?.start!
    const total = LanyardStatus.value?.spotify?.timestamps.end! - LanyardStatus.value?.spotify?.timestamps.start!
    return {
        trackElapsed: formatTime(elapsed),
        trackTotal: formatTime(total),
        trackProgress: Number(Math.min((elapsed / total) * 100, 100).toFixed(2))
    }
})
</script>

<template>
    <div class="flex items-center justify-center gap-1 px-2">
        <UPopover mode="click">
            <p class="activity hover:underline transition-all">
                <template v-if="LanyardStatus?.listening_to_spotify">
                    <UIcon name="i-heroicons-musical-note" class="w-4 h-4 items-center justify-center" /> <span
                        class="font-semibold">{{ LanyardStatus?.spotify?.song }}</span> by <span
                        class="font-semibold">{{ LanyardStatus?.spotify?.artist }}</span>
                </template>
                <template v-else-if="LanyardStatus?.activities">
                    <span>{{ firstActivity?.details ? `${firstActivity.details} on` : 'Playing' }} {{
                        firstActivity?.name }}</span>
                </template>
            </p>

            <template #panel>
                <div class="flex flex-col p-4 gap-2 w-64">
                    <div class="overflow-hidden text-ellipsis relative whitespace-nowrap font-bold text-xs">
                        {{ LanyardStatus?.listening_to_spotify ? 'Listening to Spotify' : 'Playing a Game' }}
                    </div>
                    <div class="flex flex-row w-full">
                        <div class="relative self-start" v-if="bubble.icon">
                            <NuxtLink external
                                :to="`https://open.spotify.com/track/${LanyardStatus?.spotify?.track_id}`">
                                <img :src="bubble.icon" class="h-16 w-16 rounded-md" />
                            </NuxtLink>
                        </div>
                        <div class="ml-2.5 flex-1">
                            <p class="text-sm font-bold">{{ bubble.title }}</p>
                            <p class="text-xs font-normal">{{ bubble.subtitle }}</p>
                            <p class="text-xs font-normal">{{ bubble.subsubtitle }}</p>
                            <p class="text-xs font-normal" v-if="!LanyardStatus?.listening_to_spotify">{{
                                formatFancyTime(currentTime - bubble.timestamps?.start!) }} elapsed</p>
                        </div>
                    </div>
                    <div class="flex flex-col" v-if="LanyardStatus?.listening_to_spotify">
                        <UProgress :value="timing.trackProgress" size="sm" />
                        <div class="grid grid-cols-2 pt-0.5">
                            <div class="col-start-1 justify-self-start text-xs font-normal">
                                {{ timing.trackElapsed }}
                            </div>
                            <div class="col-start-2 justify-self-end text-xs font-normal">
                                {{ timing.trackTotal }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
    </div>
</template>

<style scoped>
.activity {
    background-image: repeating-linear-gradient(45deg, violet, indigo, blue, green, yellow, orange, red, violet);
    text-align: center;
    background-size: 800% 800%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbow 8s ease infinite;
}

@keyframes rainbow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 25%
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>