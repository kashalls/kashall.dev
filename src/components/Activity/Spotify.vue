<template>
    <div class="flex flex-col gap-2 p-1 w-64 text-xs font-normal whitespace-nowrap text-ellipsis overflow-hidden">
        <div class="text-xs font-bold overflow-hidden">
            Listening to Spotify
        </div>
        <div class="flex flex-row">
            <div class="self-start relative" v-if="lanyard?.spotify!.album_art_url">
                <NuxtLink external :to="trackUrl">
                    <img :src="lanyard.spotify.album_art_url" class="h-16 w-16 aspect-square rounded-md" />
                </NuxtLink>
            </div>
            <div :class="cn(
                'flex-auto text-ellipsis',
                lanyard.spotify!.album_art_url ? 'ml-2.5' : ''
            )">
                <div>
                    <NuxtLink external :to="trackUrl" class="text-sm font-bold hover:underline">{{
                        lanyard.spotify!.song
                        }}
                    </NuxtLink>
                    <div class="text-xs leading-4 font-normal">by <span>{{ lanyard.spotify!.artist }}</span>
                    </div>
                    <div class="text-xs leading-4 font-normal">on <span>{{ lanyard.spotify!.album }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col" v-if="lanyard.spotify!.timestamps">
            <UProgress size="sm" :value="timing.trackProgress" />
            <div class="grid grid-cols-2 pt-0.5">
                <span class="col-start-1 justify-self-start" v-if="lanyard.spotify!.timestamps.start">
                    {{ formatTime(elapsed) }}
                </span>
                <span class="col-start-2 justify-self-end">
                    {{ timing.trackTotal }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const lanyard = useLanyard()

const { timestamp } = useTimestamp()
const trackUrl = computed(() => {
    if (!lanyard.value?.spotify) return ''
    return `https://open.spotify.com/track/${lanyard.value!.spotify!.track_id}`
})

const elapsed = computed(() => {
    return timestamp.value - lanyard.value!.spotify!.timestamps.start
})

const timing = computed(() => {
    const total = lanyard.value!.spotify?.timestamps.end! - lanyard.value!.spotify!.timestamps.start!
    return {
        trackTotal: formatTime(total),
        trackProgress: Number(Math.min((elapsed.value / total) * 100, 100).toFixed(2))
    }
})

</script>