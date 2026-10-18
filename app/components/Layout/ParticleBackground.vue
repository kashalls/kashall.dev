<script setup lang="ts">
const props = defineProps<{ dispersed?: boolean }>()
const emit = defineEmits<{ struggling: [] }>()

const canvas = ref<HTMLCanvasElement>()
const failed = ref(false)
const hidden = ref(props.dispersed)
const { reduced } = useMotionPreference()

let renderer: NebulaRenderer | undefined

const start = async () => {
  hidden.value = false
  await nextTick()
  if (!canvas.value) return
  renderer = createNebulaRenderer(canvas.value, {
    src: '/nebula.jpg',
    reduced: reduced.value,
    onStruggle: () => emit('struggling'),
  })
  renderer.ready.catch(() => { failed.value = true })
}

onMounted(() => {
  if (!props.dispersed) start()
})

watch(() => props.dispersed, async (dispersed) => {
  if (!dispersed) {
    renderer?.dispose()
    start()
    return
  }
  const current = renderer
  await current?.disperse()
  // unticked again while the cloud was leaving
  if (renderer !== current || !props.dispersed) return
  current?.dispose()
  renderer = undefined
  hidden.value = true
})

watch(reduced, value => renderer?.setReduced(value))

onBeforeUnmount(() => renderer?.dispose())
</script>

<template>
  <canvas
    v-if="!failed && !hidden"
    ref="canvas"
    aria-hidden="true"
    class="fixed inset-0 size-full pointer-events-none"
  />
</template>
