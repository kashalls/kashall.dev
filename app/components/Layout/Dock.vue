<script setup lang="ts">
const { closed, open } = useWindows()
</script>

<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0"
        leave-active-class="transition duration-200" leave-to-class="opacity-0">
        <div v-if="closed.length" class="flex items-center gap-2">
            <span class="text-[0.7rem] uppercase tracking-widest text-dimmed">Closed</span>
            <TransitionGroup enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95"
                leave-active-class="transition duration-150 absolute" leave-to-class="opacity-0 scale-95"
                tag="div" class="flex items-center gap-1.5">
                <UButton v-for="win in closed" :key="win.id" :label="win.title"
                    :icon="win.icon || 'i-ph-app-window'" size="xs" color="primary" variant="soft"
                    :aria-label="`Reopen ${win.title}`" @click="open(win.id)" />
            </TransitionGroup>
        </div>
    </Transition>
</template>
