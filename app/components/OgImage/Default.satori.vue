<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    badge?: string
}>(), {
    title: 'Jordan Jones',
    description: 'Freelance Software Engineer',
    badge: 'kashall.dev',
})
</script>

<template>
    <!-- Satori renders this to a 1200x630 PNG; keep to inline styles + flex. -->
    <div
        style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:90px;font-family:sans-serif;color:#ffffff;background:#0a0a12;background-image:radial-gradient(900px circle at 15% 110%, rgba(168,85,247,0.45), transparent 60%), linear-gradient(135deg,#0a0a12,#140b24);">
        <div style="display:flex;align-items:center;font-size:26px;color:#a855f7;letter-spacing:2px;text-transform:uppercase;">
            {{ badge }}
        </div>
        <div style="display:flex;font-size:84px;font-weight:800;line-height:1.05;margin-top:24px;max-width:920px;">
            {{ title }}
        </div>
        <div style="display:flex;font-size:36px;color:#cbd5e1;margin-top:24px;max-width:900px;">
            {{ description }}
        </div>
        <div style="display:flex;margin-top:auto;height:8px;width:160px;border-radius:9999px;background:linear-gradient(90deg,#a855f7,#6366f1);" />
    </div>
</template>
