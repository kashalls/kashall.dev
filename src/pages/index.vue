<template>
  <section class="flex flex-col justify-center select-none pt-4 md:pt-0">
    <div class="flex flex-col gap-12" ref="bounds">
      <div class="container flex justify-center mx-auto w-full">
        <div class="relative flex w-full flex-col gap-4 md:w-10/12 xl:aspect-[6/4] xl:w-11/12"
          ref="panels">
          <div class="w-full transition-all ease-out odd:ml-auto xl:absolute xl:w-[--d-width] odd:xl:ml-0 xl:top-16">
            <UiPanel title="Hello There">
              <div
                class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                <p>Hi, I'm <span class="text-primary">Jordan</span>, a freelance <span class="text-blue-500">Software
                    Engineer</span>.</p>
                <p>I specialize in <span class="text-pink-500">writing intergrations</span> that makes <span
                    class="text-orange-400">existing software more extensible</span>.</p>
                <p>On the side, I provide <span class="text-green-400">Residential & Business IT Services</span>, <span
                    class="text-red-400">Full-stack Web Development</span> & <span class="text-yellow-300">Managed
                    Infrastructure Services</span>.</p>
              </div>
            </UiPanel>
          </div>

          <div
            class="w-10/12 sm:w-8/12 md:w-7/12 transition-all ease-out odd:ml-auto xl:absolute xl:w-[--d-width] odd:xl:ml-0 xl:top-16 xl:right-28">
            <UiPanel title="Me" :padded="false">
              <div class="aspect-1 self-start touch-none w-full">
                <img
                  src="https://media.licdn.com/dms/image/C5603AQGPgqQ1nQ2m7Q/profile-displayphoto-shrink_800_800/0/1664234534140?e=1725494400&v=beta&t=mhcyq8oNyKVnDOc-ImC-qx5sXypL8oPRuASyTKcXRPk"
                  class="object-cover" />
              </div>
            </UiPanel>
          </div>

          <div
            class="w-10/12 sm:w-8/12 md:w-7/12 transition-all ease-out odd:ml-auto xl:absolute xl:w-[--d-width] odd:xl:ml-0 xl:top-72 xl:right-0">
            <ActivityLanyard id="discord-activity" :bounds="bounds" />
          </div>

          <div
            class="w-10/12 sm:w-8/12 md:w-7/12 transition-all ease-out odd:ml-auto xl:absolute xl:w-[--d-width] odd:xl:ml-0 xl:top-72 xl:right-72">
            <UiPanel title="Base Of Operations">
              <div
                class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                <p>I'm located in <ULink to="https://en.wikipedia.org/wiki/Eugene,_Oregon" external
                    inactive-class="text-primary">Eugene, Oregon</ULink>.</p>
                <p>Available for consultancy inside the United States.</p>
              </div>
            </UiPanel>
          </div>
          <div
            class="w-10/12 sm:w-8/12 md:w-7/12 transition-all ease-out odd:ml-auto xl:absolute xl:w-[--d-width] odd:xl:ml-0 xl:top-72">
            <UiPanel title="Technologies">
              <div class="p-1">
                <div>
                  <p class="text-green-500">Frontend</p>
                  <ol
                    class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end"">
                    <li>Nuxt / Vue</li>
                    <li>Wordpress / PHP</li>
                  </ol>
                </div>
                <div>
                  <p class=" text-blue-500">Orchestration</p>
                    <ol
                      class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                      <li>k3s / k8s (Kubernetes)</li>
                      <li>Rancher</li>
                    </ol>
                </div>
                <div>
                  <p class="text-red-500">Languages</p>
                  <ol
                    class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                    <li>Javascript / Typescript</li>
                    <li>Java</li>
                    <li>Golang</li>
                    <li>C / C++</li>
                  </ol>
                </div>
              </div>
            </UiPanel>
          </div>
          <div
            class="w-10/12 sm:w-8/12 md:w-7/12 transition-all ease-out odd:ml-auto xl:w-max xl:absolute odd:xl:ml-0 xl:top-15 xl:left-72 xl:top-72">
            <UiPanel title="Certifications">
              <div
                class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                <p>
                  <ULink to="https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/"
                    external inactive-class="text-blue-500">Linux Foundation: KCNA</ULink>
                </p>
              </div>
            </UiPanel>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $Draggable } = useNuxtApp()
const bounds = ref()
const panels = ref()

onMounted(() => {
  $Draggable.create(panels.value.children, {
    type: 'x,y',
    zIndexBoost: false,
    edgeResistance: 0.75,
    bounds: bounds.value,
  })
})

onUnmounted(() => {
  $Draggable.get(panels.value.children).kill()
})
</script>