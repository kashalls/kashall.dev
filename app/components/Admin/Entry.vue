<script setup lang="ts">
const props = defineProps<{ source: { slug: string, path: string, title: string, comments: PostComment[] }, comment: PostComment }>()
const emit = defineEmits<{ changed: [] }>()

const api = computed(() => `/api/comments/${props.source.slug}`)
const name = (comment: PostComment) => comment.author?.name || comment.author?.login || 'Removed'
const parent = computed(() => props.source.comments.find(comment => comment.id === props.comment.replyTo))

const replying = ref(false)
const content = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = (e: any, fallback: string) => e?.data?.message || e?.data?.statusMessage || fallback

async function reply() {
    if (!content.value.trim() || busy.value) return
    busy.value = true
    message.value = ''
    try {
        await $fetch(api.value, { method: 'POST', body: { content: content.value, replyTo: props.comment.id } })
        content.value = ''
        replying.value = false
        emit('changed')
    } catch (e) {
        message.value = errorMessage(e, 'Could not post the reply. Please try again.')
    } finally {
        busy.value = false
    }
}

async function remove() {
    if (!window.confirm('Remove this? Its replies stay up.')) return
    busy.value = true
    message.value = ''
    try {
        await $fetch(api.value, { method: 'DELETE', query: { id: props.comment.id } })
        emit('changed')
    } catch (e) {
        message.value = errorMessage(e, 'Could not remove it. Please try again.')
    } finally {
        busy.value = false
    }
}
</script>

<template>
    <article class="item">
        <p class="item-meta">
            <NuxtLink :to="`${source.path}#comment-${comment.id}`" class="text-(--accent) hover:text-(--fg)">{{ source.title }}</NuxtLink>
            · <span class="text-(--fg-2)">{{ name(comment) }}</span>
            · <time :datetime="comment.createdAt">{{ formatDate(new Date(comment.createdAt)) }}</time>
        </p>
        <p v-if="parent" class="truncate text-xs text-(--fg-3)">Replying to {{ name(parent) }}: {{ parent.removed ? 'a removed comment' : parent.content }}</p>
        <p class="item-text whitespace-pre-wrap break-words">{{ comment.content }}</p>

        <form v-if="replying" class="mt-2 flex flex-col gap-2" @submit.prevent="reply">
            <UTextarea v-model="content" :rows="2" autoresize :maxlength="1000" autofocus aria-label="Your reply"
                :placeholder="`Reply to ${name(comment)}…`" />
            <div class="flex items-center gap-5 text-sm">
                <UButton type="submit" label="Post reply" variant="outline" size="sm" :loading="busy" :disabled="!content.trim()" />
                <button type="button" class="text-(--fg-3) hover:text-(--fg)" @click="replying = false">Cancel</button>
            </div>
        </form>
        <p v-else class="mt-1 flex gap-5 text-sm">
            <button type="button" class="text-(--accent) hover:text-(--fg)" @click="replying = true">Reply</button>
            <button type="button" class="text-(--fg-3) hover:text-[#ff7a6b]" :disabled="busy" @click="remove">Remove</button>
        </p>
        <p v-if="message" role="status" class="text-sm text-(--fg-3)">{{ message }}</p>
    </article>
</template>
