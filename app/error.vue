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

const goHome = () => clearError({ redirect: '/' })
const reload = () => { if (import.meta.client) window.location.reload() }
</script>

<template>
    <UApp>
        <NuxtLayout name="default">
            <StatusWindows :code="meta.code" :title="meta.title" :description="meta.description">
                <UButton icon="i-ph-house" color="primary" @click="goHome">Go home</UButton>
                <UButton icon="i-ph-arrow-clockwise" color="primary" variant="ghost" @click="reload">Reload</UButton>
            </StatusWindows>
        </NuxtLayout>
    </UApp>
</template>
