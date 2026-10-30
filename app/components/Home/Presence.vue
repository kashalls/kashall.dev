<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import type { LanyardData } from '~/types/lanyard'

type Activity = LanyardData['activities'][number]

const lanyard = useState<LanyardData>('lanyard')
const now = ref(Date.now())
useIntervalFn(() => { now.value = Date.now() }, 1000)

const custom = computed(() => lanyard.value?.activities.find(a => a.type === ActivityType.Custom))
const spotify = computed(() => lanyard.value?.listening_to_spotify ? lanyard.value.spotify : null)
// Spotify gets its own card from `spotify`; 6 is Discord's "hang" status, which has nothing to show.
const activities = computed(() => (lanyard.value?.activities ?? [])
  .filter(a => a.type !== ActivityType.Custom && a.type !== 6 && !a.id.startsWith('spotify:')))

const VERB: Record<number, string> = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' }
const art = (a: Activity) => activityImageUrl(a.application_id, a.assets?.large_image)
const badge = (a: Activity) => activityImageUrl(a.application_id, a.assets?.small_image)

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor(s / 60) % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}
const elapsed = (start: number) => clock(now.value - start)
const count = computed(() => activities.value.length + (spotify.value ? 1 : 0))
const open = ref(false)
const progress = computed(() => {
  const t = spotify.value?.timestamps
  return t?.end ? Math.min(1, (now.value - t.start) / (t.end - t.start)) : 0
})
</script>

<template>
  <section v-if="lanyard" class="presence" aria-label="Discord presence">
    <p class="presence-status">
      <span class="presence-avatar">
        <NuxtImg :src="avatarUrl(lanyard.discord_user.id, lanyard.discord_user.avatar)" alt="" width="20" height="20" />
        <span class="presence-dot" :style="{ background: statusColor(lanyard.discord_status) }" />
      </span>
      <span><span :style="{ color: statusColor(lanyard.discord_status) }">{{ STATUS[lanyard.discord_status]?.label ?? 'Offline' }}</span> on Discord</span>
      <span v-if="custom?.state || custom?.emoji" class="presence-custom">
        <NuxtImg v-if="custom.emoji?.id" :src="`https://cdn.discordapp.com/emojis/${custom.emoji.id}.webp?size=32`"
          :alt="custom.emoji.name" width="14" height="14" class="inline size-3.5 align-[-2px]" />
        <template v-else-if="custom.emoji">{{ custom.emoji.name }}</template>
        {{ custom.state }}
      </span>
    </p>

    <TransitionGroup tag="ul" name="presence-card" class="presence-cards" :class="{ 'is-open': open }">
      <li v-if="spotify" key="spotify" class="presence-card">
        <NuxtImg :src="spotify.album_art_url" :alt="spotify.album" width="44" height="44" class="presence-art" />
        <div class="presence-body">
          <p class="presence-kind">
            <UIcon name="i-simple-icons-spotify" class="text-[#1ed760]" /> Listening on Spotify
            <span v-if="spotify.timestamps.end" class="ml-auto">{{ elapsed(spotify.timestamps.start) }} / {{ clock(spotify.timestamps.end - spotify.timestamps.start) }}</span>
          </p>
          <p class="presence-title">{{ spotify.song }}</p>
          <p class="presence-line">{{ spotify.artist }}</p>
        </div>
        <span class="presence-bar"><span :style="{ width: `${progress * 100}%` }" /></span>
      </li>
      <li v-for="a in activities" :key="a.id" class="presence-card">
        <span class="presence-art">
          <NuxtImg v-if="art(a)" :src="art(a)" :alt="a.assets?.large_text ?? ''" width="44" height="44" />
          <UIcon v-else name="i-ph-game-controller" class="size-5 text-(--fg-3)" />
          <NuxtImg v-if="badge(a)" :src="badge(a)" :alt="a.assets?.small_text ?? ''" width="18" height="18" class="presence-badge" />
        </span>
        <div class="presence-body">
          <p class="presence-kind">
            {{ VERB[a.type] ?? 'Playing' }}
            <span v-if="a.timestamps?.start" class="ml-auto">{{ elapsed(a.timestamps.start) }}</span>
          </p>
          <p class="presence-title">{{ a.name }}</p>
          <p v-if="a.details || a.state" class="presence-line">{{ [a.details, a.state].filter(Boolean).join(' · ') }}</p>
        </div>
      </li>
    </TransitionGroup>
    <button v-if="count > 1" type="button" class="presence-toggle" :aria-expanded="open" @click="open = !open">
      {{ open ? 'Show less' : `+${count - 1} more` }}
    </button>
  </section>
</template>

<style scoped>
.presence {
  --card: 4.25rem;
  --peek: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: min(21rem, 100%);
  margin-bottom: 1.25rem;
}

.presence-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.55rem;
  font-size: 0.85rem;
  color: var(--fg-3);
}

.presence-avatar {
  position: relative;
  flex-shrink: 0;
}

.presence-avatar img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.presence-dot {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 9px;
  height: 9px;
  border: 2px solid #000;
  border-radius: 50%;
}

.presence-custom {
  color: var(--fg-2);
}

.presence-toggle {
  align-self: flex-start;
  margin-top: -0.2rem;
  font-size: 0.75rem;
  color: var(--fg-3);
  transition: color 200ms;
}

.presence-toggle:hover,
.presence-toggle:focus-visible {
  color: var(--fg);
}

/* Cards stack with the first in front and the rest peeking out below it;
   hovering or "Show all" fans them out. */
.presence-cards {
  display: flex;
  flex-direction: column;
}

.presence-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: var(--card);
  padding: 0 0.75rem;
  overflow: hidden;
  border: 1px solid var(--rule);
  border-radius: 0.5rem;
  background: rgb(8 6 16 / 0.85);
  backdrop-filter: blur(8px);
  transition: margin-top 350ms cubic-bezier(.3, .7, .4, 1), scale 350ms cubic-bezier(.3, .7, .4, 1), opacity 350ms;
}

.presence-card:nth-child(1) { z-index: 3; }
.presence-card:nth-child(2) { z-index: 2; margin-top: calc(var(--peek) - var(--card)); scale: 0.95; opacity: 0.8; }
.presence-card:nth-child(n + 3) { z-index: 1; margin-top: calc(var(--peek) - var(--card)); scale: 0.9; opacity: 0.6; }
.presence-card:nth-child(n + 4) { opacity: 0; }

/* Only the front card's contents show until the stack fans out. */
.presence-card:nth-child(n + 2) > * {
  opacity: 0;
  transition: opacity 250ms;
}

.presence-cards.is-open .presence-card > * {
  opacity: 1;
}

.presence-cards.is-open .presence-card:nth-child(n + 2) {
  margin-top: 0.5rem;
  scale: 1;
  opacity: 1;
}

@media (hover: hover) {
  .presence-cards:hover .presence-card:nth-child(n + 2) {
    margin-top: 0.5rem;
    scale: 1;
    opacity: 1;
  }

  .presence-cards:hover .presence-card > * {
    opacity: 1;
  }
}

.presence-art {
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 0.3rem;
  background: rgb(194 165 255 / 0.07);
}

.presence-art > img:first-child,
img.presence-art {
  width: 44px;
  height: 44px;
  border-radius: 0.3rem;
  object-fit: cover;
}

.presence-badge {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 18px;
  height: 18px;
  border: 2px solid #08060f;
  border-radius: 50%;
}

.presence-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.presence-kind {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  color: var(--fg-3);
}

.presence-title,
.presence-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.presence-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--fg);
}

.presence-line {
  font-size: 0.78rem;
  color: var(--fg-2);
}

.presence-bar {
  position: absolute;
  inset: auto 0 0;
  height: 2px;
  background: rgb(194 165 255 / 0.12);
}

.presence-bar > span {
  display: block;
  height: 100%;
  background: #1ed760;
  transition: width 1s linear;
}

.presence-card-enter-from,
.presence-card-leave-to {
  opacity: 0;
}

.presence-card-leave-active {
  position: absolute;
}
</style>
