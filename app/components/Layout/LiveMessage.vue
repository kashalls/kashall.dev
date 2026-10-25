<script setup lang="ts">
// Remembers the dismissed text, so a new message shows again.
const DISMISSED_KEY = 'kashall-live-dismissed'

const { messages } = useSiteMessages()
const dismissed = ref<string | null>(null)

onMounted(() => {
    try {
        dismissed.value = localStorage.getItem(DISMISSED_KEY)
    } catch {}
})

const message = computed(() => messages.value.live)

function dismiss() {
    dismissed.value = message.value
    try {
        localStorage.setItem(DISMISSED_KEY, message.value)
    } catch {}
}
</script>

<template>
    <!-- Opaque, since it floats over the page's text. -->
    <UAlert v-if="message && message !== dismissed" icon="i-ph-broadcast" color="primary" variant="outline"
        title="Live" :description="message" close
        class="fixed bottom-16 right-4 z-50 w-auto max-w-sm bg-default shadow-lg" @update:open="dismiss" />
</template>
