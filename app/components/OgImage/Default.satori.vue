<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    badge?: string
}>(), {
    title: 'Jordan Jones',
    description: 'Freelance Software Engineer',
    badge: 'ok8.sh',
})
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG. Vertical padding is added on top of
         the height and pushes the bar off the canvas, so the top and bottom
         spacing are margins instead. -->
    <div class="flex size-full flex-col px-[90px] font-jetbrains text-white"
        style="background:#0a0a12;background-image:radial-gradient(900px circle at 15% 110%, rgba(168,85,247,0.45), transparent 60%), linear-gradient(135deg,#0a0a12,#140b24);">
        <div class="my-auto flex flex-col">
            <div class="flex text-[26px] tracking-[2px] text-purple-500 uppercase">
                {{ badge }}
            </div>
            <div class="mt-6 flex max-w-[1000px] font-jakarta text-[84px] leading-[1.05] font-extrabold">
                {{ title }}
            </div>
            <!-- Satori supports the plain line-clamp property, not Tailwind's -webkit-box version. -->
            <div class="mt-6 block max-w-[1000px] text-[32px] text-slate-300" style="line-clamp:2">
                {{ description }}
            </div>
        </div>
        <div class="mb-[70px] flex h-2 w-40 rounded-full" style="background:linear-gradient(90deg,#a855f7,#6366f1);" />
    </div>
</template>
