<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    date?: string
    tags?: string[]
}>(), {
    title: 'Blog',
    description: '',
    date: '',
    tags: () => [],
})
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG. Vertical padding is added on top of
         the height and pushes the footer off the canvas, so the top and bottom
         spacing are margins instead. -->
    <div class="flex size-full flex-col px-[90px] font-jetbrains text-white"
        style="background:#0a0a12;background-image:radial-gradient(900px circle at 85% -10%, rgba(168,85,247,0.4), transparent 60%), linear-gradient(135deg,#0a0a12,#140b24);">
        <div class="mt-20 flex text-[26px] tracking-[2px] text-purple-500 uppercase">
            ok8.sh / posts
        </div>
        <div class="mt-10 flex max-w-[1000px] font-jakarta leading-[1.1] font-extrabold"
            :class="title.length > 50 ? 'text-[60px]' : 'text-[72px]'">
            {{ title }}
        </div>
        <!-- Satori supports the plain line-clamp property, not Tailwind's -webkit-box version. -->
        <div v-if="description" class="mt-6 block max-w-[1000px] text-[28px] text-slate-300" style="line-clamp:2">
            {{ description }}
        </div>
        <div class="mt-auto mb-[70px] flex items-center text-2xl text-slate-400">
            <div class="flex text-white">Jordan Jones</div>
            <div v-if="date" class="ml-4 flex">· {{ date }}</div>
            <div class="ml-auto flex">
                <div v-for="tag in tags.slice(0, 3)" :key="tag"
                    class="ml-3 flex rounded-full border-2 border-purple-500/60 px-3.5 py-1.5 text-purple-300">
                    #{{ tag }}
                </div>
            </div>
        </div>
    </div>
</template>
