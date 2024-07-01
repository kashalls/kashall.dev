<template>
    <div
        class="grid-cols-3 items-center gap-4 border-b border-gray-900 hidden md:grid bg-gradient-to-tr from-[#0e0c12]/25 to-[#0e0f0f]/25 pr-1">
        <div class="col-start-1 items-center justify-center pl-1 pr-1.5">
            <UButton to="/" class="transition hover:text-primary-200" variant="ghost" color="purple">
                <Logo class="h-5 w-5" />
            </UButton>
        </div>

        <NuxtLink to="/" aria-label="Jordan Jones" class="col-start-2 justify-self-center text-neutral-50">
            
        </NuxtLink>
        <div class="flex gap-2 text-gray-700 col-start-3 justify-self-end">
            <UButton icon="i-ph-line-vertical" size="xs" color="purple" square variant="ghost" padded class="rotate-90" />
            <UButton icon="i-ph-square" size="xs" color="purple" square variant="ghost" padded />
            <UButton icon="i-ph-x" size="xs" color="purple" square variant="ghost" padded />
        </div>
    </div>
</template>