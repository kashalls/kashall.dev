<script setup lang="ts">
const props = defineProps<{ path: string, guestbook?: boolean }>()
const noun = computed(() => props.guestbook ? 'entry' : 'comment')

// Posts are prerendered, so comments and the session always load in the browser.
const api = computed(() => `/api/comments/${props.path.replace(/^\/(posts\/)?/, '')}`)
const { data, status, refresh } = useFetch<{ comments: PostComment[], viewerIsOwner: boolean }>(api, { server: false, lazy: true, deep: true })
const { loggedIn, user, clear } = useUserSession()
const signInFailed = useSignInFailed()
const signInUrl = computed(() => `/auth/github?redirect=${encodeURIComponent(`${props.path}#comments`)}`)

// The session loads after the comments, so refetch for the viewer's hearts.
watch(loggedIn, () => refresh())

const comments = computed(() => data.value?.comments ?? [])
const byId = computed(() => new Map(comments.value.map(comment => [comment.id, comment])))
const threads = computed(() => comments.value
    .filter(comment => !comment.threadId)
    .map(comment => ({ comment, replies: comments.value.filter(reply => reply.threadId === comment.id) })))
const total = computed(() => comments.value.filter(comment => !comment.removed).length)
const isOwner = computed(() => !!data.value?.viewerIsOwner)

const content = ref('')
const replyTo = ref<PostComment | null>(null)
const textarea = ref()
const posting = ref(false)
const busy = ref<string | null>(null)
const message = ref('')

const errorMessage = (e: any, fallback: string) => e?.data?.message || e?.data?.statusMessage || fallback
const name = (comment: PostComment) => comment.author?.name || comment.author?.login || 'Removed'
const canRemove = (comment: PostComment) => isOwner.value || comment.author?.id === user.value?.id

const canPost = computed(() => !!content.value.trim() && !posting.value)

function reply(comment: PostComment) {
    replyTo.value = comment
    message.value = ''
    textarea.value?.textareaRef?.focus()
}

async function post() {
    if (!canPost.value) return
    posting.value = true
    message.value = ''
    try {
        const { comment } = await $fetch<{ comment: PostComment }>(api.value, {
            method: 'POST',
            body: { content: content.value, replyTo: replyTo.value?.id ?? null },
        })
        data.value?.comments.push(comment)
        content.value = ''
        replyTo.value = null
        message.value = props.guestbook ? 'Entry posted.' : 'Comment posted.'
    } catch (e) {
        message.value = errorMessage(e, `Could not post the ${noun.value}. Please try again.`)
    } finally {
        posting.value = false
    }
}

async function heart(comment: PostComment) {
    busy.value = comment.id
    try {
        Object.assign(comment, await $fetch<Pick<PostComment, 'hearts' | 'hearted'>>(api.value, { method: 'PATCH', body: { id: comment.id, hearted: !comment.hearted } }))
    } catch (e) {
        message.value = errorMessage(e, 'Could not update the heart. Please try again.')
    } finally {
        busy.value = null
    }
}

async function remove(comment: PostComment) {
    if (!window.confirm(`Remove this ${noun.value}? Its replies stay up.`)) return
    busy.value = comment.id
    try {
        await $fetch(api.value, { method: 'DELETE', query: { id: comment.id } })
        if (replyTo.value?.id === comment.id) replyTo.value = null
        await refresh()
        message.value = props.guestbook ? 'Entry removed.' : 'Comment removed.'
    } catch (e) {
        message.value = errorMessage(e, `Could not remove the ${noun.value}. Please try again.`)
    } finally {
        busy.value = null
    }
}

async function signOut() {
    await clear()
    replyTo.value = null
    message.value = ''
}
</script>

<template>
    <section id="comments" aria-labelledby="comments-heading" class="flex flex-col gap-4">
        <div class="flex items-baseline justify-between gap-3">
            <h2 id="comments-heading" class="font-display text-xl text-highlighted">{{ guestbook ? 'Entries' : 'Discussion' }}</h2>
            <span v-if="data" class="text-sm text-muted">{{ total }} {{ total === 1 ? noun : guestbook ? 'entries' : 'comments' }}</span>
        </div>

        <form v-if="loggedIn && user" class="flex flex-col gap-3 rounded-lg border border-default bg-elevated/30 p-4"
            @submit.prevent="post">
            <div class="flex items-center gap-2 text-sm">
                <UAvatar :src="user.avatar" :alt="user.login" size="xs" />
                <span class="text-highlighted">{{ user.name || user.login }}</span>
                <UBadge v-if="isOwner" label="Author" icon="i-ph-seal-check" size="sm" variant="subtle" />
                <UButton label="Sign out" size="xs" color="neutral" variant="link" class="ml-auto text-muted"
                    @click="signOut" />
            </div>

            <div v-if="replyTo" class="flex items-start gap-2 rounded-md border border-default px-3 py-2 text-sm">
                <UIcon name="i-ph-arrow-bend-down-right" class="mt-0.5 size-4 shrink-0 text-primary" />
                <div class="min-w-0 flex-1">
                    <p class="text-muted">Replying to <strong class="text-highlighted">{{ name(replyTo) }}</strong></p>
                    <p class="truncate text-dimmed">{{ replyTo.content }}</p>
                </div>
                <UButton icon="i-ph-x" size="xs" color="neutral" variant="ghost" aria-label="Cancel reply"
                    @click="replyTo = null" />
            </div>

            <UTextarea ref="textarea" v-model="content" :rows="3" autoresize :maxlength="1000" required
                :aria-label="replyTo ? 'Your reply' : `Your ${noun}`"
                :placeholder="replyTo ? 'Add your reply…' : guestbook ? 'Say hello, or leave a note…' : 'Leave a thought, a question, a little hello…'" />

            <div class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-xs" :class="content.length >= 950 ? 'text-error' : 'text-dimmed'">
                    {{ content.length >= 850 ? `${content.length}/1000` : `Posting as @${user.login}` }}
                </span>
                <UButton type="submit" :loading="posting" :disabled="!canPost" trailing-icon="i-ph-arrow-up-right"
                    :label="replyTo ? 'Post reply' : guestbook ? 'Sign the guestbook' : 'Post comment'" />
            </div>
        </form>

        <div v-else class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-default bg-elevated/30 p-4">
            <p v-if="signInFailed" role="alert" class="w-full text-sm text-error">Couldn't sign in with GitHub. Please try again.</p>
            <p class="text-sm text-muted">Sign in with GitHub to {{ guestbook ? 'sign the guestbook' : 'join the discussion' }}.</p>
            <UButton :to="signInUrl" external icon="i-simple-icons-github" label="Sign in with GitHub" variant="outline" />
        </div>

        <p v-if="message" role="status" class="text-sm text-muted">{{ message }}</p>
        <p v-if="status === 'error'" role="alert" class="text-sm text-muted">
            Could not load {{ guestbook ? 'the guestbook' : 'comments' }}.
            <UButton label="Try again" color="neutral" variant="link" class="p-0" @click="refresh()" />
        </p>
        <!-- Keyed on data, not status: status is idle when prerendered but pending while hydrating. -->
        <p v-else-if="!data" class="text-sm text-muted">Loading {{ guestbook ? 'the guestbook' : 'comments' }}…</p>
        <p v-else-if="!threads.length" class="text-sm text-muted">{{ guestbook ? 'No one has signed yet. Be the first.' : 'No comments yet. Start the conversation.' }}</p>

        <div v-for="thread in threads" :key="thread.comment.id" class="flex flex-col gap-3">
            <div v-for="comment in [thread.comment, ...thread.replies]" :id="`comment-${comment.id}`" :key="comment.id"
                class="flex flex-col gap-1.5 rounded-lg border p-4"
                :class="[comment.threadId && 'ml-6 sm:ml-10', comment.isOwner && !comment.removed ? 'border-primary/40 bg-primary/5' : 'border-default']">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <template v-if="comment.author">
                        <UAvatar :src="comment.author.avatar" :alt="comment.author.login" size="2xs" />
                        <NuxtLink :to="`https://github.com/${comment.author.login}`" external target="_blank"
                            class="font-semibold text-highlighted hover:text-primary">{{ name(comment) }}</NuxtLink>
                    </template>
                    <strong v-else class="text-highlighted">Removed</strong>
                    <UBadge v-if="comment.isOwner && !comment.removed" label="Author" icon="i-ph-seal-check" size="sm"
                        variant="subtle" />
                    <time :datetime="comment.createdAt" class="text-dimmed">{{ formatDate(new Date(comment.createdAt)) }}</time>
                </div>
                <p v-if="comment.replyTo && comment.replyTo !== comment.threadId" class="text-xs text-dimmed">
                    Replying to {{ byId.get(comment.replyTo) && !byId.get(comment.replyTo)!.removed ? name(byId.get(comment.replyTo)!) : 'a removed comment' }}
                </p>
                <p class="whitespace-pre-wrap break-words" :class="comment.removed ? 'italic text-dimmed' : 'text-default'">
                    {{ comment.removed ? `This ${noun} was removed.` : comment.content }}
                </p>
                <div v-if="!comment.removed" class="-ml-2 flex items-center gap-1">
                    <UButton :icon="comment.hearted ? 'i-ph-heart-fill' : 'i-ph-heart'" :label="String(comment.hearts)"
                        size="xs" variant="ghost" :color="comment.hearted ? 'primary' : 'neutral'"
                        :aria-pressed="comment.hearted" :aria-label="`${comment.hearted ? 'Remove heart' : 'Give a heart'} (${comment.hearts})`"
                        :disabled="!loggedIn || busy === comment.id" @click="heart(comment)" />
                    <UButton v-if="loggedIn" icon="i-ph-arrow-bend-up-left" label="Reply" size="xs" color="neutral"
                        variant="ghost" @click="reply(comment)" />
                    <UButton v-if="loggedIn && canRemove(comment)" icon="i-ph-trash" label="Remove" size="xs"
                        color="error" variant="ghost" :disabled="busy === comment.id" @click="remove(comment)" />
                </div>
            </div>
        </div>
    </section>
</template>
