<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

const { shortSha, ref: gitRef, time, commitUrl } = useBuildInfo()
const builtAgo = useTimeAgo(time)
</script>

<template>
    <UTooltip v-if="shortSha" :text="`Deployed from ${gitRef} · built ${builtAgo}`">
        <UButton :to="commitUrl" target="_blank" icon="i-ph-git-commit" :label="shortSha" size="sm" color="neutral"
            variant="ghost" class="font-mono text-dimmed" />
    </UTooltip>
</template>
