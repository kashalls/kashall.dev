<script setup lang="ts">
const lanyard = useLanyard()
const profile = useDiscordProfile()
const { timestamp } = useTimestamp()

const user = computed(() => lanyard.value?.discord_user)

// Banner, bio, pronouns and connections come from the profile proxy (Lanyard omits them).
const banner = computed(() => bannerUrl(user.value?.id ?? profile.value?.user.id, profile.value?.user.banner, 600))
const bannerColor = computed(() => profile.value?.user.banner_color ?? '#5865f2')
const bio = computed(() => parseDiscordText(profile.value?.user_profile?.bio ?? profile.value?.user.bio))
const pronouns = computed(() => profile.value?.user_profile?.pronouns)
const connections = computed(() => mapConnections(profile.value?.connected_accounts))
const loaded = computed(() => !!user.value)
const status = computed(() => lanyard.value?.discord_status ?? 'offline')

const avatar = computed(() => avatarUrl(user.value, 128))
const decoration = computed(() => decorationUrl(user.value))
const guildBadge = computed(() => guildTagBadgeUrl(user.value))
const guildTag = computed(() => user.value?.primary_guild?.tag)
const badges = computed(() => userBadges(user.value))

const displayName = computed(() => user.value?.display_name || user.value?.global_name || user.value?.username || 'Kashall')
const username = computed(() => user.value?.username)
const joinedAt = computed(() => snowflakeToDate(user.value?.id)?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))

// Custom status (activity type 4)
const customStatus = computed(() => lanyard.value?.activities?.find(a => a.type === 4))
const customEmoji = computed(() => {
    const e = customStatus.value?.emoji
    if (!e?.id) return null
    return `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}?size=24&quality=lossless`
})

// Live activities — this is the part that appears / disappears.
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

const roles = [
    { label: 'Nuxt / Vue', color: 'bg-green-400' },
    { label: 'TypeScript', color: 'bg-blue-500' },
    { label: 'Golang', color: 'bg-cyan-400' },
    { label: 'Kubernetes', color: 'bg-sky-500' },
    { label: 'PHP', color: 'bg-violet-500' },
]

function spotifyProgress(s: any) {
    const total = s.timestamps.end - s.timestamps.start
    const elapsed = Math.min(Math.max(timestamp.value - s.timestamps.start, 0), total)
    return {
        pct: total > 0 ? Math.min(100, (elapsed / total) * 100) : 0,
        elapsed: formatTime(elapsed),
        total: formatTime(total),
    }
}

function hideOnError(e: Event) {
    (e.target as HTMLElement).style.display = 'none'
}
</script>

<template>
    <div class="w-full text-slate-200">
        <!-- Banner -->
        <div class="relative h-24 w-full overflow-hidden" :style="{ backgroundColor: bannerColor }">
            <NuxtImg v-if="banner" :src="banner" alt="banner" width="600" height="240"
                class="h-full w-full object-cover" loading="lazy" draggable="false" @error="hideOnError" />
            <div v-else class="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_120%,#ffffff,transparent_55%)]" />
        </div>

        <!-- Avatar + status -->
        <div class="relative px-4">
            <div class="absolute -top-10 left-4">
                <div class="relative h-[84px] w-[84px] rounded-full border-[5px] border-[#0b0b10] bg-[#0b0b10]">
                    <svg width="74" height="74" viewBox="0 0 74 74" class="block">
                        <defs>
                            <mask id="discord-avatar-mask">
                                <circle cx="37" cy="37" r="37" fill="white" />
                                <circle cx="61" cy="61" r="13" fill="black" />
                            </mask>
                        </defs>
                        <foreignObject x="0" y="0" width="74" height="74" mask="url(#discord-avatar-mask)">
                            <NuxtImg v-if="avatar" :src="avatar" width="74" height="74"
                                class="block h-full w-full object-cover" @error="hideOnError" />
                            <div v-else class="h-full w-full animate-pulse rounded-full bg-zinc-700" />
                        </foreignObject>
                        <circle cx="61" cy="61" r="8" :fill="statusColor(status)" />
                    </svg>
                    <img v-if="decoration" :src="decoration"
                        class="pointer-events-none absolute left-1/2 top-1/2 h-[102px] w-[102px] max-w-none -translate-x-1/2 -translate-y-1/2"
                        @error="hideOnError" />
                </div>
            </div>

            <!-- Badges (top-right of body) -->
            <div class="flex h-12 items-center justify-end gap-1">
                <img v-for="badge in badges" :key="badge.label" :src="badge.src" :alt="badge.label" :title="badge.label"
                    class="h-[22px] w-[22px]" draggable="false" @error="hideOnError" />
            </div>
        </div>

        <!-- Identity -->
        <div class="px-4 pb-1">
            <div class="flex items-center gap-2">
                <h2 v-if="loaded" class="text-xl font-bold leading-6 text-white">{{ displayName }}</h2>
                <div v-else class="h-5 w-28 animate-pulse rounded bg-zinc-700" />
                <span v-if="guildTag"
                    class="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-semibold text-slate-200">
                    <img v-if="guildBadge" :src="guildBadge" class="h-3.5 w-3.5" draggable="false" @error="hideOnError" />
                    {{ guildTag }}
                </span>
            </div>
            <p v-if="username" class="text-sm text-slate-400">@{{ username }}</p>
        </div>

        <!-- Body -->
        <div class="px-4 pb-4 pt-2 text-sm">
            <!-- Custom status -->
            <div v-if="customStatus?.state" class="flex items-center gap-1.5 pb-2.5">
                <img v-if="customEmoji" :src="customEmoji" class="h-5 w-5" draggable="false" @error="hideOnError" />
                <span>{{ customStatus.state }}</span>
            </div>

            <div class="mb-3 h-px w-full bg-zinc-800" />

            <!-- Live activity (appears / disappears) -->
            <div class="mb-3">
                <h3 class="mb-2 text-xs font-bold uppercase leading-4 text-slate-300">Activity</h3>
                <TransitionGroup tag="div" class="relative flex flex-col gap-2"
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-1.5 scale-[0.98]"
                    leave-active-class="transition duration-200 ease-in absolute w-full"
                    leave-to-class="opacity-0 translate-y-1.5 scale-[0.98]"
                    move-class="transition-transform duration-300">
                    <div v-if="!activities.length" key="idle"
                        class="rounded-lg bg-zinc-800/60 px-3 py-2 text-xs italic text-slate-400">
                        {{ loaded ? 'Not doing anything right now.' : 'Connecting to Discord…' }}
                    </div>

                    <div v-for="item in activities" :key="item.key" class="flex gap-3 rounded-lg bg-zinc-800/60 p-2.5">
                        <!-- Spotify -->
                        <template v-if="item.kind === 'spotify'">
                            <NuxtLink external :to="`https://open.spotify.com/track/${item.spotify.track_id}`"
                                class="shrink-0">
                                <img :src="item.spotify.album_art_url" class="h-14 w-14 rounded" loading="lazy" draggable="false" />
                            </NuxtLink>
                            <div class="min-w-0 flex-1">
                                <p class="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-green-400">
                                    <UIcon name="i-ph-spotify-logo-fill" class="h-3.5 w-3.5" /> Listening to Spotify
                                </p>
                                <p class="truncate text-sm font-bold text-white">{{ item.spotify.song }}</p>
                                <p class="truncate text-xs text-slate-400">by {{ item.spotify.artist }}</p>
                                <div class="mt-1.5">
                                    <UProgress :model-value="spotifyProgress(item.spotify).pct" size="xs" color="success" />
                                    <div class="flex justify-between pt-1 text-[0.65rem] text-slate-400">
                                        <span>{{ spotifyProgress(item.spotify).elapsed }}</span>
                                        <span>{{ spotifyProgress(item.spotify).total }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Game / rich presence -->
                        <template v-else>
                            <img :src="activityImage(item.activity)" :alt="item.activity.name"
                                class="h-14 w-14 shrink-0 rounded object-cover" loading="lazy" draggable="false" @error="hideOnError" />
                            <div class="min-w-0 flex-1">
                                <p class="text-[0.7rem] font-semibold uppercase tracking-wide text-primary-400">
                                    {{ ActivityType[item.activity.type] }}
                                </p>
                                <p class="truncate text-sm font-bold text-white">{{ item.activity.name }}</p>
                                <p v-if="item.activity.details" class="truncate text-xs text-slate-400">{{ item.activity.details }}</p>
                                <p v-if="item.activity.state" class="truncate text-xs text-slate-400">{{ item.activity.state }}</p>
                            </div>
                        </template>
                    </div>
                </TransitionGroup>
            </div>

            <!-- About Me -->
            <div v-if="bio.length || pronouns" class="mb-3">
                <h3 class="mb-1.5 text-xs font-bold uppercase leading-4 text-slate-300">About Me</h3>
                <p v-if="pronouns" class="mb-1 text-xs text-slate-400">{{ pronouns }}</p>
                <div class="flex flex-col gap-0.5 text-slate-300">
                    <p v-for="(line, i) in bio" :key="i" class="flex flex-wrap items-center gap-x-1 leading-6">
                        <template v-for="(token, j) in line" :key="j">
                            <img v-if="token.type === 'emoji'" :src="token.src" :alt="token.name"
                                class="inline-block h-5 w-5 align-text-bottom" draggable="false" @error="hideOnError" />
                            <ULink v-else-if="token.type === 'link'" :to="token.href" external
                                inactive-class="text-primary-400 hover:underline">{{ token.value }}</ULink>
                            <span v-else>{{ token.value }}</span>
                        </template>
                    </p>
                </div>
            </div>

            <!-- Connections -->
            <div v-if="connections.length" class="mb-3">
                <h3 class="mb-1.5 text-xs font-bold uppercase leading-4 text-slate-300">Connections</h3>
                <div class="flex flex-wrap gap-1.5">
                    <component :is="conn.href ? 'a' : 'div'" v-for="conn in connections" :key="conn.type"
                        :href="conn.href || undefined" :target="conn.href ? '_blank' : undefined"
                        rel="noopener noreferrer" :title="`${conn.label}: ${conn.name}`"
                        class="flex items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-slate-200 transition-colors"
                        :class="conn.href && 'hover:bg-zinc-700'">
                        <UIcon :name="conn.icon" class="h-4 w-4" :style="{ color: conn.color }" />
                        <span class="max-w-[120px] truncate">{{ conn.name }}</span>
                    </component>
                </div>
            </div>

            <!-- Member Since -->
            <div v-if="joinedAt" class="mb-3">
                <h3 class="mb-1.5 text-xs font-bold uppercase leading-4 text-slate-300">Member Since</h3>
                <p class="flex items-center gap-2 text-slate-300">
                    <UIcon name="i-ph-discord-logo" class="h-4 w-4 text-slate-400" /> {{ joinedAt }}
                </p>
            </div>

            <!-- Roles -->
            <div class="mb-3">
                <h3 class="mb-1.5 text-xs font-bold uppercase leading-4 text-slate-300">Roles</h3>
                <div class="flex flex-wrap gap-1">
                    <span v-for="role in roles" :key="role.label"
                        class="flex items-center gap-1.5 rounded bg-zinc-800 px-1.5 py-1 text-xs font-medium">
                        <span :class="['h-2.5 w-2.5 rounded-full', role.color]" />
                        {{ role.label }}
                    </span>
                </div>
            </div>

            <!-- Note -->
            <div>
                <h3 class="mb-1.5 text-xs font-bold uppercase leading-4 text-slate-300">Note</h3>
                <p class="text-xs text-slate-400">
                    Website made with <ULink to="https://nuxt.com" external inactive-class="text-primary-400 hover:underline">Nuxt</ULink>
                    &amp; <ULink to="https://tailwindcss.com" external inactive-class="text-primary-400 hover:underline">TailwindCSS</ULink>.
                </p>
            </div>
        </div>
    </div>
</template>
