<script setup lang="ts">
definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })
useRobotsRule(false)

const { loggedIn } = useUserSession()
// Rendered per request, so the session and everything below load on the server.
// /api/admin answers 404 to anyone but the site owner.
const { data, error, refresh } = await useFetch('/api/admin/comments', { immediate: loggedIn.value })
if (error.value?.statusCode === 404)
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const entries = computed(() => (data.value?.sources ?? [])
    .flatMap(source => source.comments.filter(comment => !comment.removed).map(comment => ({ source, comment })))
    .sort((a, b) => b.comment.createdAt.localeCompare(a.comment.createdAt)))
// Answered once you've posted in its thread after it.
const unanswered = computed(() => entries.value.filter(({ source, comment }) => !comment.isOwner
    && !source.comments.some(other => other.isOwner
        && (other.threadId ?? other.id) === (comment.threadId ?? comment.id)
        && other.createdAt > comment.createdAt)))

const { messages } = useSiteMessages()
const { data: meta } = await useFetch('/api/meta', { immediate: loggedIn.value })
const draft = reactive({ maintenance: meta.value?.messages.maintenance ?? '', live: meta.value?.messages.live ?? '' })
const saving = ref(false)
const saved = ref('')

async function saveMessages() {
    saving.value = true
    saved.value = ''
    try {
        const result = await $fetch('/api/admin/messages', { method: 'PUT', body: draft })
        messages.value = result.messages
        saved.value = 'Saved. Visitors see it within about a minute.'
    } catch (e: any) {
        saved.value = e?.data?.message || e?.data?.statusMessage || 'Could not save the messages. Please try again.'
    } finally {
        saving.value = false
    }
}
</script>

<template>
  <main class="column column-wide">
    <h1 class="page-name">Admin</h1>

    <template v-if="!loggedIn">
      <p class="lead">Sign in to manage the site.</p>
      <UButton to="/auth/github?redirect=/admin" external icon="i-simple-icons-github" label="Sign in with GitHub"
        variant="outline" class="mt-6 self-start" />
    </template>

    <p v-else-if="error" role="alert" class="lead">{{ error.statusMessage || 'Could not load the admin page.' }}</p>

    <template v-else>
      <section aria-labelledby="messages-heading">
        <h2 id="messages-heading" class="group-label">Messages</h2>
        <form class="flex flex-col gap-5" @submit.prevent="saveMessages">
          <UFormField label="Maintenance" help="Shown in the bottom right corner, or under the nav on phones. Leave it empty to hide it.">
            <UTextarea v-model="draft.maintenance" :rows="1" autoresize :maxlength="280" class="w-full" />
          </UFormField>
          <UFormField label="Status" help="Stored under the live key. Nothing on the site shows it yet.">
            <UTextarea v-model="draft.live" :rows="1" autoresize :maxlength="280" class="w-full" />
          </UFormField>
          <div class="flex flex-wrap items-center gap-4">
            <UButton type="submit" label="Save messages" variant="outline" :loading="saving" />
            <p v-if="saved" role="status" class="text-sm text-(--fg-3)">{{ saved }}</p>
          </div>
        </form>
      </section>

      <section aria-labelledby="inbox-heading">
        <h2 id="inbox-heading" class="group-label">Needs a reply <span class="text-(--fg-3)">{{ unanswered.length }}</span></h2>
        <p v-if="!unanswered.length" class="item-text">You're all caught up.</p>
        <ul v-else class="list">
          <li v-for="entry in unanswered" :key="entry.comment.id">
            <AdminEntry :source="entry.source" :comment="entry.comment" @changed="refresh()" />
          </li>
        </ul>
      </section>

      <section aria-labelledby="all-heading">
        <h2 id="all-heading" class="group-label">Everything <span class="text-(--fg-3)">{{ entries.length }}</span></h2>
        <p v-if="!entries.length" class="item-text">No one has written anything yet.</p>
        <ul v-else class="list">
          <li v-for="entry in entries" :key="entry.comment.id">
            <AdminEntry :source="entry.source" :comment="entry.comment" @changed="refresh()" />
          </li>
        </ul>
      </section>
    </template>
  </main>
</template>
