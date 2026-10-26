<script setup lang="ts">
const lanyard = useLanyard()
const profile = useDiscordProfile()
const { timestamp } = useTimestamp()

const user = computed(() => lanyard.value?.discord_user)
const loaded = computed(() => !!user.value)
const status = computed(() => lanyard.value?.discord_status ?? 'offline')
const statusLabel = computed(() => STATUS[status.value as keyof typeof STATUS]?.label ?? STATUS.offline.label)

const banner = bannerUrl(DISCORD_USER_ID, 1024)
const bannerFailed = ref(false)
const bannerColor = computed(() => profile.value?.user?.banner_color ?? '#5865f2')
const avatar = computed(() => avatarUrl(user.value, 128))
const decoration = computed(() => decorationUrl(user.value))
const username = computed(() => user.value?.username)

const customStatus = computed(() => lanyard.value?.activities?.find(a => a.type === 4))
const customEmoji = computed(() => {
    const e = customStatus.value?.emoji
    if (!e?.id) return null
    return `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}?size=24&quality=lossless`
})

const activities = computed(() => {
    const out: Array<Record<string, any>> = []
    const l = lanyard.value
    if (l?.listening_to_spotify && l.spotify) {
        out.push({ key: `spotify-${l.spotify.track_id}`, kind: 'spotify', spotify: l.spotify })
    }
    for (const a of (l?.activities ?? []).filter(a => ![2, 4, 6].includes(a.type))) {
        out.push({ key: `act-${a.id}`, kind: 'app', activity: a })
    }
    return out
})

const selectedKey = ref<string>()
const featured = computed(() => activities.value.find(a => a.key === selectedKey.value) ?? activities.value[0])

function activityThumb(item: Record<string, any>) {
    return item.kind === 'spotify' ? item.spotify.album_art_url : activityImage(item.activity)
}

function activityName(item: Record<string, any>) {
    return item.kind === 'spotify' ? `${item.spotify.song} by ${item.spotify.artist}` : item.activity.name
}

function spotifyProgress(s: any) {
    const total = s.timestamps.end - s.timestamps.start
    const elapsed = Math.min(Math.max(timestamp.value - s.timestamps.start, 0), total)
    return {
        pct: total > 0 ? Math.min(100, (elapsed / total) * 100) : 0,
        elapsed: formatTime(elapsed),
        total: formatTime(total),
    }
}

// NuxtImg's error event can also carry a string, which has no element to hide.
function hideOnError(e: string | Event) {
    if (typeof e !== 'string') (e.target as HTMLElement).style.display = 'none'
}
</script>

<template>
    <div>
        <!-- Banner -->
        <div class="relative h-28 w-full overflow-hidden sm:h-40" :style="{ backgroundColor: bannerColor }">
            <NuxtImg v-if="!bannerFailed" :src="banner" alt="" width="1024" height="410" class="h-full w-full object-cover"
                loading="lazy" draggable="false" @error="bannerFailed = true" />
            <div v-else class="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_120%,#ffffff,transparent_55%)]" />
        </div>

        <div class="mx-4 flex flex-col gap-4 border-b border-default pb-4 lg:flex-row lg:items-end">
            <!-- Identity -->
            <div class="flex min-w-0 flex-1 items-end gap-4">
                <!-- Avatar overlaps the banner; the ring matches the panel so it reads as a cut-out. -->
                <div class="relative -mt-11 h-[92px] w-[92px] shrink-0 rounded-full border-[6px] border-white bg-white dark:border-[#0e0c12] dark:bg-[#0e0c12]">
                    <svg width="80" height="80" viewBox="0 0 80 80" class="block">
                        <defs>
                            <mask id="profile-avatar-mask">
                                <circle cx="40" cy="40" r="40" fill="white" />
                                <circle cx="66" cy="66" r="14" fill="black" />
                            </mask>
                        </defs>
                        <foreignObject x="0" y="0" width="80" height="80" mask="url(#profile-avatar-mask)">
                            <NuxtImg v-if="avatar" :src="avatar" width="80" height="80"
                                class="block h-full w-full object-cover" @error="hideOnError" />
                            <div v-else class="h-full w-full animate-pulse rounded-full bg-accented" />
                        </foreignObject>
                        <circle cx="66" cy="66" r="9" :fill="statusColor(status)" />
                    </svg>
                    <NuxtImg v-if="decoration" :src="decoration"
                        class="pointer-events-none absolute left-1/2 top-1/2 h-[98px] w-[98px] max-w-none -translate-x-1/2 -translate-y-1/2"
                        @error="hideOnError" />
                </div>

                <div class="min-w-0 pt-3">
                    <div class="flex flex-wrap items-baseline gap-x-2">
                        <h1 class="text-xl font-bold leading-6 text-highlighted">Jordan Jones</h1>
                        <span v-if="username" class="text-sm text-muted">@{{ username }}</span>
                    </div>
                    <p class="flex items-center gap-1.5 text-xs text-muted">
                        <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: statusColor(status) }" />
                        {{ loaded ? statusLabel : 'Connecting…' }} on Discord
                    </p>
                    <p v-if="customStatus?.state" class="mt-1 flex items-center gap-1.5 text-sm text-default">
                        <NuxtImg v-if="customEmoji" :src="customEmoji" class="h-4 w-4" draggable="false" @error="hideOnError" />
                        <span class="truncate">{{ customStatus.state }}</span>
                    </p>
                </div>
            </div>

            <!-- Live activity (only when something is happening); one card at a time, the rest behind thumbnails -->
            <div class="relative lg:w-80 lg:shrink-0 lg:pt-3">
                <!-- Every card shares one grid cell so switching never changes the height. -->
                <TransitionGroup tag="div" class="relative grid"
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-1.5 scale-[0.98]"
                    leave-active-class="transition duration-200 ease-in absolute w-full"
                    leave-to-class="opacity-0 translate-y-1.5 scale-[0.98]"
                    move-class="transition-transform duration-300">
                    <div v-for="item in activities" :key="item.key" :aria-hidden="item.key !== featured?.key"
                        class="col-start-1 row-start-1 flex gap-3 rounded-lg bg-elevated/70 p-2.5 backdrop-blur transition-opacity duration-300"
                        :class="{ 'invisible opacity-0': item.key !== featured?.key }">
                        <template v-if="item.kind === 'spotify'">
                            <NuxtLink external :to="`https://open.spotify.com/track/${item.spotify.track_id}`" class="shrink-0">
                                <NuxtImg :src="item.spotify.album_art_url" class="h-12 w-12 rounded-md" loading="lazy" draggable="false" />
                            </NuxtLink>
                            <div class="min-w-0 flex-1">
                                <p class="flex items-center gap-1 text-[0.65rem] font-semibold text-green-600 dark:text-green-400">
                                    <UIcon name="i-ph-spotify-logo" class="h-3.5 w-3.5" /> Listening to Spotify
                                </p>
                                <p class="truncate text-sm font-bold text-highlighted">{{ item.spotify.song }}</p>
                                <p class="truncate text-xs text-muted">by {{ item.spotify.artist }}</p>
                                <div class="mt-1 flex items-center gap-2 text-[0.6rem] tabular-nums text-muted">
                                    <span>{{ spotifyProgress(item.spotify).elapsed }}</span>
                                    <UProgress :model-value="spotifyProgress(item.spotify).pct" size="xs" color="success" class="flex-1" />
                                    <span>{{ spotifyProgress(item.spotify).total }}</span>
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <NuxtImg :src="activityImage(item.activity)" :alt="item.activity.name"
                                class="h-12 w-12 shrink-0 rounded-md object-cover" loading="lazy" draggable="false" @error="hideOnError" />
                            <div class="min-w-0 flex-1">
                                <p class="text-[0.65rem] font-semibold text-primary">
                                    {{ ActivityType[item.activity.type] }}
                                </p>
                                <p class="truncate text-sm font-bold text-highlighted">{{ item.activity.name }}</p>
                                <p v-if="item.activity.details" class="truncate text-xs text-muted">{{ item.activity.details }}</p>
                                <p v-if="item.activity.state" class="truncate text-xs text-muted">{{ item.activity.state }}</p>
                            </div>
                        </template>
                    </div>
                </TransitionGroup>
                <div v-if="activities.length > 1" class="absolute right-2.5 top-2.5 z-10 flex gap-1 lg:top-5.5">
                    <UTooltip v-for="item in activities" :key="item.key" :text="activityName(item)">
                        <button type="button" :aria-label="activityName(item)" :aria-pressed="item.key === featured?.key"
                            class="h-5 w-5 overflow-hidden rounded bg-accented ring-1 transition"
                            :class="item.key === featured?.key ? 'ring-primary' : 'opacity-50 ring-transparent hover:opacity-100'"
                            @click="selectedKey = item.key">
                            <NuxtImg :src="activityThumb(item)" alt="" class="h-full w-full object-cover" draggable="false" @error="hideOnError" />
                        </button>
                    </UTooltip>
                </div>
            </div>
        </div>
    </div>
</template>
