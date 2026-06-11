<template>
  <section class="flex flex-col justify-center select-none pt-4 md:pt-0">
    <div class="flex flex-col gap-12 pb-[40dvh]" ref="bounds">
      <div class="container flex justify-center mx-auto w-full">
        <div
          class="relative flex w-full flex-col gap-4 md:w-10/12 xl:aspect-[6/4] xl:w-11/12 xl:[--d-width:21rem]"
          ref="panels">
          <!-- Intro -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[5%] xl:top-6"
            data-window-id="hello-there">
            <UiPanel title="Hello There" icon="i-ph-hand-waving">
              <div
                class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                <p>Hi, I'm <span class="text-primary">Jordan</span>, a freelance <span class="text-blue-500">Software
                    Engineer</span>.</p>
                <p>I specialize in <span class="text-pink-500">writing integrations</span> that make <span
                    class="text-orange-400">existing software more extensible</span>.</p>
                <p>On the side, I provide <span class="text-green-400">Residential &amp; Business IT Services</span>,
                  <span class="text-red-400">Full-stack Web Development</span> &amp; <span class="text-yellow-300">Managed
                    Infrastructure Services</span>.</p>
              </div>
            </UiPanel>
          </div>

          <!-- Portrait -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[31%] xl:top-6"
            data-window-id="me">
            <UiPanel title="Me" icon="i-ph-user" :padded="false">
              <div
                class="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900/40 via-black to-black">
                <div
                  class="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_25%,rgb(var(--color-primary-500)),transparent_60%)]" />
                <div class="relative flex flex-col items-center gap-3">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full border border-primary-500/30 bg-black/40 backdrop-blur">
                    <Logo class="h-9 w-9" />
                  </div>
                  <p class="text-xs font-medium text-neutral-400">Photo coming soon</p>
                </div>
              </div>
            </UiPanel>
          </div>

          <!-- Discord profile -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[81%] xl:top-6"
            data-window-id="discord">
            <UiPanel title="Discord" icon="i-ph-discord-logo" :padded="false">
              <DiscordCard />
            </UiPanel>
          </div>

          <!-- Technologies -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[31%] xl:top-[21rem]"
            data-window-id="technologies">
            <UiPanel title="Technologies" icon="i-ph-stack">
              <div class="flex flex-col gap-3 p-1">
                <div>
                  <p class="text-green-500">Frontend</p>
                  <ol
                    class="*:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                    <li>Nuxt / Vue</li>
                    <li>Wordpress / PHP</li>
                  </ol>
                </div>
                <div>
                  <p class="text-blue-500">Orchestration</p>
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

          <!-- Location -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[5%] xl:top-[23rem]"
            data-window-id="base-of-operations">
            <UiPanel title="Base Of Operations" icon="i-ph-map-pin">
              <div
                class="p-1 *:mb-1 *:font-medium *:pl-5 *:before:content-['*'] *:before:-ml-5 *:before:w-5 *:before:text-right *:before:px-2 *:before:inline-flex *:before:justify-end">
                <p>I'm located in <ULink to="https://en.wikipedia.org/wiki/Eugene,_Oregon" external
                    inactive-class="text-primary">Eugene, Oregon</ULink>.</p>
                <p>Available for consultancy inside the United States.</p>
              </div>
            </UiPanel>
          </div>

          <!-- GitHub stats -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[56%] xl:top-6"
            data-window-id="github">
            <UiPanel title="GitHub" icon="i-ph-github-logo">
              <GithubStats />
            </UiPanel>
          </div>

          <!-- Homelab -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[56%] xl:top-[22rem]"
            data-window-id="homelab">
            <UiPanel title="Homelab" icon="i-simple-icons-kubernetes">
              <HomelabStats />
            </UiPanel>
          </div>

          <!-- NAS -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[56%] xl:top-[44rem]"
            data-window-id="nas">
            <UiPanel title="NAS" icon="i-ph-hard-drives">
              <HomelabNas />
            </UiPanel>
          </div>

          <!-- Certifications -->
          <div
            class="w-full max-w-md mx-auto transition-all ease-out xl:absolute xl:max-w-none xl:mx-0 xl:w-(--d-width) xl:left-[5%] xl:top-[34.5rem]"
            data-window-id="certifications">
            <UiPanel title="Certifications" icon="i-ph-certificate">
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
defineOgImage('Default', {
  title: 'Jordan Jones',
  description: 'Freelance Software Engineer — integrations, full-stack & infrastructure.',
})

const { $Draggable, $gsap } = useNuxtApp()
const { registry, setPosition, reset } = useWindows()
const { signal: resetSignal } = useResetLayout()
const { reduced } = useMotionPreference()
const bounds = ref()
const panels = ref()

let zIndex = 1
let draggables: any[] = []

onMounted(() => {
  // Restore any saved drag positions before wiring up the draggable.
  for (const el of panels.value.children as Iterable<HTMLElement>) {
    const win = registry.value[el.dataset.windowId ?? '']
    if (win && (win.x || win.y)) $gsap.set(el, { x: win.x, y: win.y })
  }

  draggables = $Draggable.create(panels.value.children, {
    type: 'x,y',
    zIndexBoost: false,
    edgeResistance: 0.75,
    bounds: bounds.value,
    onPress() {
      // Bring the grabbed window to the front of the stack.
      this.target.style.zIndex = String(++zIndex)
    },
    onDragEnd() {
      const id = this.target.dataset.windowId
      if (id) setPosition(id, this.x, this.y)
    },
  })
})

watch(resetSignal, () => {
  // Clear saved layout (reopens, un-minimizes, zeroes positions), then animate home.
  reset()
  zIndex = 1
  draggables.forEach(d => $gsap.to(d.target, {
    x: 0,
    y: 0,
    duration: reduced.value ? 0 : 0.5,
    ease: 'power3.out',
    clearProps: 'zIndex',
    onComplete: () => d.update(),
  }))
})

onUnmounted(() => {
  $Draggable.get(panels.value.children).kill()
})
</script>
