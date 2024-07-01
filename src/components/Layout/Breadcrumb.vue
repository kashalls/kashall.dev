<script setup lang="ts">
const route = useRoute()

const isNotRoot = computed(() => {
    return route.path === '/'
})

const crumbs = computed(() => {
    const pathArray = route.path.split('/').filter(path => path)
    return pathArray.map((segment, index) => {
        const to = `/${pathArray.slice(0, index + 1).join('/')}`
        return {
            icon: to === '/' ? 'i-heroicons-home' : '',
            label: segment,
            to
        }
    })
})
</script>

<template>
    <div class="hidden h-full md:block">
        <UBreadcrumb v-if="isNotRoot" :links="crumbs" />
    </div>
</template>
