<script setup lang="ts">
const route = useRoute()
</script>

<template>
    <header
        class="flex border-b border-default bg-gradient-to-tr from-white/25 to-white/25 dark:from-[#0e0c12]/25 dark:to-[#0e0f0f]/25 [grid-area:header]">
        <!-- Same width as the home page, a little wider than the posts layout. -->
        <div class="mx-auto flex w-full max-w-[96rem] items-center gap-1 px-2 md:px-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-2">
            <div class="flex items-center gap-1">
                <UButton to="/" color="neutral" variant="ghost" aria-label="Home"
                    class="gap-2.5 font-semibold text-highlighted transition hover:text-primary">
                    <Logo class="size-6" />
                    <span class="hidden font-display sm:inline">Jordan Jones</span>
                </UButton>
                <nav class="hidden items-center sm:flex">
                    <UButton to="/posts" label="Posts" color="neutral" variant="ghost"
                        :class="route.path.startsWith('/posts') ? 'text-highlighted' : 'text-muted hover:text-highlighted'" />
                </nav>
            </div>

            <div class="ms-auto lg:ms-0">
                <LayoutCommandPalette />
            </div>

            <div class="flex items-center gap-1 lg:justify-self-end">
                <!-- No room below lg; the mobile menu carries them there. -->
                <LayoutDisplay />
                <LayoutSocial class="hidden lg:flex" />
                <LayoutMobileMenu class="lg:hidden" />
            </div>
        </div>
    </header>
</template>
