<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })

import type { LanyardData } from '~/types/lanyard'

const lanyard = useState<LanyardData>('lanyard')

// One line of presence, in words.
const presence = computed(() => {
  const l = lanyard.value
  if (!l) return undefined
  if (l.listening_to_spotify && l.spotify) return `Listening to ${l.spotify.song} by ${l.spotify.artist}`
  const activity = l.activities?.find(a => ![2, 4, 6].includes(a.type))
  if (activity) return `${ActivityType[activity.type]} ${activity.name}`
  return `${STATUS[l.discord_status]?.label ?? 'Offline'} on Discord`
})

defineOgImage('Default', {
  title: 'Jordan Jones',
  description: 'Freelance Software Engineer — integrations, full-stack & infrastructure.',
})
</script>

<template>
  <main class="home">
    <ClientOnly>
      <Transition name="presence" mode="out-in">
        <p v-if="presence" :key="presence" class="home-presence">{{ presence }}</p>
      </Transition>
    </ClientOnly>
    <div class="home-about">
      <p class="tone-who">Hi, I'm <span>Jordan</span>, a <span>Platform Engineer</span> with a <span>software engineering background</span>.</p>
      <p class="tone-work">I design and maintain <span>Kubernetes infrastructure</span> and write <span>tooling that makes platforms more extensible</span>.</p>
      <p class="tone-side">On the side, I provide <span>Residential &amp; Business IT Services</span>, <span>Full&#8209;stack Web Development</span> &amp; <span>Managed Infrastructure Services</span>.</p>
    </div>
    <h1 class="home-name">Jordan Jones</h1>
  </main>
</template>

<style scoped>
.home {
  position: absolute;
  z-index: 4;
  left: clamp(1.25rem, 4vw, 3.5rem);
  right: clamp(1.25rem, 4vw, 3.5rem);
  bottom: clamp(1rem, 4vh, 2.5rem);
}

.home-name {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 11vw, 10.5rem);
  line-height: 0.82;
  letter-spacing: -0.035em;
  color: var(--fg);
}

.home-about {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-width: 46rem;
  margin-bottom: clamp(1rem, 3vh, 1.75rem);
  font-size: clamp(1rem, 1.35vw, 1.15rem);
  line-height: 1.5;
  text-wrap: balance;
}

/* Grey, so each sentence's coloured phrases stand out. */
.home-about p {
  color: var(--fg-2);
}

.home-presence {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--fg-3);
}

.home-presence::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px 1px var(--accent);
}

.presence-enter-active,
.presence-leave-active {
  transition: opacity 400ms;
}

.presence-enter-from,
.presence-leave-to {
  opacity: 0;
}
</style>
