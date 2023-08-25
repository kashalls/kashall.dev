<template>
  <header
    class="relative flex flex-col w-full items-center justify-center overflow-hidden top-0 -mt-16 container max-w-[98rem] py-12 mx-auto px-6 lg:px-16 xl:px-20">
    <div
      class="pt-16 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">

      <div class="grid grid-cols-1 md:grid-cols-2 [>div]:my-auto gap-20">
        <div class="h-full">
          <h1
            class="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Hey there! I'm <span class="">Kashall</span>.
          </h1>
          <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
            I dabble in everything technology. My speciality is making technology communicate with each other.
          </p>

          <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
            My spare time consists of me tinkering with my <a href="https://github.com/kashalls/home-cluster">homelab</a>.
          </p>

          <div class="flex space-x-4 my-8 animate-[fadeInDown_1.2s_ease_800ms_backwards]">
            <a v-for="link in links" :key="link.href" :href="link.href">
              <Icon :name="link.icon" size="36px" color="white" />
            </a>
          </div>
        </div>
        <div class="md:flex flex-col items-center">
          <img class="rounded-3xl h-96 w-96 justify-center shadow-2xl" :src="profilePicture" />
        </div>
      </div>
      <div class="mt-16 relative bottom-0">
        <DiscordPresence :presence="lanyard" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useLanyard } from "@leonardssh/use-lanyard";
const { public: { DISCORD_USER_ID } } = useRuntimeConfig()
const lanyard = ref()

useLanyard({
  userId: DISCORD_USER_ID,
  socket: true,
  onPresenceUpdate(presence) {
    lanyard.value = presence
  }
})

const pfpType = computed(() => {
  return lanyard.value?.discord_user.avatar.startsWith('a_') ? 'gif' : 'png'
})

const profilePicture = computed(() => `https://api.lanyard.rest/${DISCORD_USER_ID}.${pfpType.value}`)
const links = ref([
  {
    icon: "eva:github-outline",
    href: "https://github.com/kashalls"
  },
  {
    icon: "eva:linkedin-outline",
    href: "https://www.linkedin.com/in/jordpjones/"
  },
  {
    icon: "eva:email-outline",
    href: "mailto:pm@kashall.dev"
  }
])
</script>
