<script setup lang="ts">
const { open, closeContact } = useContact()

const form = reactive({ name: '', email: '', message: '' })
const token = ref('')
const turnstile = ref()
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() =>
    !!form.name.trim() && !!form.email.trim() && !!form.message.trim() && !!token.value && !loading.value)

async function submit() {
    if (!canSubmit.value) return
    loading.value = true
    errorMsg.value = ''
    try {
        await $fetch('/api/contact', { method: 'POST', body: { ...form, token: token.value } })
        sent.value = true
    } catch (e: any) {
        errorMsg.value = e?.data?.statusMessage || e?.statusMessage || 'Something went wrong. Please try again.'
        // Tokens are single-use — reset the widget so a retry gets a fresh one.
        token.value = ''
        turnstile.value?.reset?.()
    } finally {
        loading.value = false
    }
}

// Reset state each time the dialog is opened.
watch(open, (isOpen) => {
    if (isOpen) {
        sent.value = false
        errorMsg.value = ''
        Object.assign(form, { name: '', email: '', message: '' })
        token.value = ''
    }
})
</script>

<template>
    <UModal v-model:open="open" :ui="{ content: 'w-full sm:max-w-md' }">
        <template #content>
        <div
            class="flex flex-col overflow-hidden rounded border border-gray-900 bg-gradient-to-tr from-[#0e0c12]/95 to-[#0e0f0f]/90 backdrop-blur-3xl">
            <!-- Title bar -->
            <div class="flex h-10 shrink-0 items-center border-b border-gray-900 px-4">
                <p class="flex items-center gap-2 font-body text-sm text-neutral-50">
                    <UIcon name="i-ph-envelope-simple" class="h-4 w-4 text-primary-400" /> Send me a message
                </p>
                <UButton icon="i-ph-x" size="xs" color="primary" variant="ghost" class="ml-auto"
                    aria-label="Close" @click="closeContact" />
            </div>

            <div class="p-4">
                <!-- Success state -->
                <div v-if="sent" class="flex flex-col items-center gap-3 py-6 text-center">
                    <UIcon name="i-ph-check-circle" class="h-10 w-10 text-green-400" />
                    <p class="font-medium text-white">Message sent!</p>
                    <p class="text-sm text-slate-400">Thanks for reaching out — I'll get back to you soon.</p>
                    <UButton color="primary" class="mt-2" @click="closeContact">Close</UButton>
                </div>

                <!-- Form -->
                <form v-else class="flex flex-col gap-3" @submit.prevent="submit">
                    <UFormField label="Name">
                        <UInput v-model="form.name" placeholder="Your name" icon="i-ph-user" autocomplete="name" autofocus />
                    </UFormField>
                    <UFormField label="Email">
                        <UInput v-model="form.email" type="email" placeholder="you@example.com"
                            icon="i-ph-envelope-simple" autocomplete="email" />
                    </UFormField>
                    <UFormField label="Message">
                        <UTextarea v-model="form.message" :rows="4" placeholder="What's up?" />
                    </UFormField>

                    <NuxtTurnstile ref="turnstile" v-model="token" />

                    <p v-if="errorMsg" class="flex items-center gap-1.5 text-sm text-red-400">
                        <UIcon name="i-ph-warning-circle" class="h-4 w-4 shrink-0" /> {{ errorMsg }}
                    </p>

                    <UButton type="submit" block color="primary" :loading="loading" :disabled="!canSubmit"
                        icon="i-ph-paper-plane-tilt">
                        Send message
                    </UButton>
                </form>
            </div>
        </div>
        </template>
    </UModal>
</template>
