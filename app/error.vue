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
        <NuxtLayout name="field">
            <main class="column">
                <h1 class="doc-title">{{ meta.title }}</h1>
                <p class="lead mt-4">{{ meta.description }}</p>
                <p class="mt-8 flex gap-6 text-sm">
                    <button type="button" class="text-(--accent) hover:text-(--fg)" @click="goHome">Go home</button>
                    <button type="button" class="text-(--fg-3) hover:text-(--fg)" @click="reload">Reload</button>
                </p>
            </main>
        </NuxtLayout>
    </UApp>
</template>
