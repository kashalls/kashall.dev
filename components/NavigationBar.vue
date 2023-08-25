<template>
  <div class="fixed z-50 top-0 w-full" :class="y > 40 ? 'shadow-md' : ''">
    <div class="-bottom-5 w-full h-6 absolute backdrop-blur-lg mask-opacity-fade opacity-90"></div>
    <div class="flex items-center flex-col transition-all transform-gpu border-b-[1.5px] backdrop-blur-2xl border-b-[#2a4cbe] bg-[#0d0b11] bg-opacity-50">
      <div class="w-full flex flex-row max-w-[98rem] py-4 mx-auto px-6 lg:px-16 xl:px-20 container">
        <NuxtLink to="/">
          <span
            class="align-bottom inline self-center text-xl font-extrabold whitespace-nowrap dark:text-white w-12 cursor-pointer hover:opacity-80">
            kashall
            <StatusIcon :status="lanyard?.discord_status" :lanyard="lanyard" />
          </span>

        </NuxtLink>
        <div class="h-auto flex items-center justify-center space-x-5 ml-auto">
          <NuxtLink to="/">
            <div class="h-auto flex space-x-2 text-sm sm:text-md leading-1 group"><span
                class="text-zinc-300 group-hover:text-white leading-6">Home</span></div>
          </NuxtLink>
          <NuxtLink to="https://github.com/kashalls/home-cluster">
            <div class="h-auto flex space-x-2 text-sm sm:text-md leading-1 group">
              <span class="text-zinc-300 group-hover:text-white leading-6">
                Homelab 
                <Icon name="pixelarticons:external-link" />
              </span>
            </div>
          </NuxtLink>
          <NuxtLink to="https://github.com/kashalls">
            <div class="h-auto flex space-x-2 text-sm sm:text-md leading-1 group"><span
                class="text-zinc-300 group-hover:text-white leading-6">
                Github
                <Icon name="pixelarticons:external-link" />
              </span></div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const lanyard = leonLanyard()
</script>