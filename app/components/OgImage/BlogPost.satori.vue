<script setup lang="ts">
const props = withDefaults(defineProps<{
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

const titleSize = computed(() => props.title.length > 50 ? 60 : 72)
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG; keep to inline styles + flex. Vertical
         padding here is added on top of the height and pushes the footer off the
         canvas, so the top and bottom spacing are margins instead. -->
    <div
        style="width:100%;height:100%;display:flex;flex-direction:column;padding:0 90px;font-family:sans-serif;color:#ffffff;background:#0a0a12;background-image:radial-gradient(900px circle at 85% -10%, rgba(168,85,247,0.4), transparent 60%), linear-gradient(135deg,#0a0a12,#140b24);">
        <div style="display:flex;align-items:center;margin-top:80px;font-size:26px;color:#a855f7;letter-spacing:2px;text-transform:uppercase;">
            ok8.sh / blog
        </div>
        <div :style="`display:flex;font-size:${titleSize}px;font-weight:700;line-height:1.1;margin-top:40px;max-width:1000px;`">
            {{ title }}
        </div>
        <div v-if="description"
            style="display:block;line-clamp:2;font-size:32px;color:#cbd5e1;margin-top:24px;max-width:1000px;">
            {{ description }}
        </div>
        <div style="display:flex;align-items:center;margin-top:auto;margin-bottom:70px;font-size:26px;color:#94a3b8;">
            <div style="display:flex;color:#ffffff;">Jordan Jones</div>
            <div v-if="date" style="display:flex;margin-left:16px;">· {{ date }}</div>
            <div style="display:flex;margin-left:auto;">
                <div v-for="tag in tags.slice(0, 3)" :key="tag"
                    style="display:flex;margin-left:12px;padding:6px 18px;border-radius:9999px;border:2px solid rgba(168,85,247,0.6);color:#d8b4fe;">
                    #{{ tag }}
                </div>
            </div>
        </div>
    </div>
</template>
