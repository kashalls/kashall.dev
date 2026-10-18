<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const meta = computed(() => statusMeta(props.error?.statusCode))

useHead({ title: () => `${meta.value.code} — ${meta.value.title}` })

defineOgImage('Default', {
    title: `${meta.value.code} — ${meta.value.title}`,
    description: meta.value.description,
    badge: 'Error',
})

const calm = ref(false)
// once someone unticks it themselves, the page stops ticking it for them
const keepParticles = ref(false)
watch(calm, (value) => { if (!value) keepParticles.value = true })
const onStruggling = () => { if (!keepParticles.value) calm.value = true }

const goHome = () => clearError({ redirect: '/' })
const reload = () => { if (import.meta.client) window.location.reload() }
</script>

<template>
    <UApp>
        <NuxtLayout name="default">
            <template #background>
                <LazyLayoutParticleBackground :dispersed="calm" @struggling="onStruggling" />
            </template>
            <StatusWindows :code="meta.code" :title="meta.title" :description="meta.description">
                <template #below>
                    <UiPanel title="Background" icon="i-ph-sparkle">
                        <UCheckbox v-model="calm" label="Woah there, my computer doesn't like that" />
                    </UiPanel>
                </template>
                <UButton icon="i-ph-house" color="primary" @click="goHome">Go home</UButton>
                <UButton icon="i-ph-arrow-clockwise" color="primary" variant="ghost" @click="reload">Reload</UButton>
            </StatusWindows>
        </NuxtLayout>
    </UApp>
</template>
