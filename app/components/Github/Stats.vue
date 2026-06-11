<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Code-split the (heavy) decorative SVG backgrounds out of the main bundle.
const BgPullRequest = defineAsyncComponent(() => import('./BgPullRequest.vue'))
const BgIssue = defineAsyncComponent(() => import('./BgIssue.vue'))
const BgComment = defineAsyncComponent(() => import('./BgComment.vue'))
const BgReaction = defineAsyncComponent(() => import('./BgReaction.vue'))

const { data: stats, pending } = useFetch('/api/github', { lazy: true })

const items = [
    { key: 'pullRequests', label: 'Pull Requests', bg: BgPullRequest, border: 'border-violet-400/50', text: 'text-violet-300' },
    { key: 'issues', label: 'Issues', bg: BgIssue, border: 'border-green-400/50', text: 'text-green-300' },
    { key: 'comments', label: 'Comments', bg: BgComment, border: 'border-blue-400/50', text: 'text-blue-300' },
    { key: 'repositories', label: 'Repositories', bg: BgReaction, border: 'border-yellow-400/50', text: 'text-yellow-200' },
] as const

const fmt = (n?: number) =>
    n == null ? '—' : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
</script>

<template>
    <div class="grid grid-cols-2 gap-2">
        <div v-for="item in items" :key="item.key"
            class="relative flex aspect-[5/4] flex-col items-center justify-end overflow-hidden rounded-xl border bg-[#020420] p-3 text-center"
            :class="item.border">
            <component :is="item.bg" />
            <div class="relative">
                <p class="text-2xl font-bold leading-none text-white">
                    <span v-if="pending" class="inline-block h-6 w-10 animate-pulse rounded bg-white/10 align-middle" />
                    <template v-else>{{ fmt(stats?.[item.key]) }}</template>
                </p>
                <p class="mt-1 text-xs font-medium" :class="item.text">{{ item.label }}</p>
            </div>
        </div>
    </div>
</template>
