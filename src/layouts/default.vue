<script setup>
useLenis()
</script>

<template>
  <div class="h-dvh relative overflow-hidden p-2 dark:bg-black bg-slate-950 text-">
    <div class="background fixed top-0 left-0 right-0 h-screen" />
    <div
      class="grid md:size-full relative h-full rounded-lg overflow-hidden border border-gray-900 transition-all duration-500 shadow-2xl grid-rows-[2.5rem_1fr_2.5rem] grid-columns-[2.5rem_1fr]">
      <LayoutHeader />

      <div class="h-auto overflow-x-hidden overflow-y-scroll scroll lenis lenis-smooth p-4" id="lenis-frame">
        <slot />
      </div>

      <div
        class="grid grid-cols-1 col-span-2 items-center gap-4 px-1 md:col-span-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] bg-gradient-to-tr from-[#0e0c12]/25 to-[#0e0f0f]/25 border-t border-gray-900">
        <div class="col-start-1">
          <LayoutColormode />
          <LayoutBreadcrumb />
        </div>
        <div class="col-start-2">
          <LayoutActivity />
        </div>
        <div class="flex h-full items-center justify-self-end">
          <LayoutSocial />
        </div>
      </div>
    </div>
  </div>
</template>


<style>
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

.lenis#lenis-frame {
  scrollbar-width: thin;
  scrollbar-color: oklch(var(--color-primary-DEFAULT)) transparent;
}

.background {
  &::after {
    content: '';
    z-index: 10;
    position: absolute;
    top: 0;
    left: 50%;
    height: 100vw;
    width: 200vw;
    background: radial-gradient(rgb(var(--color-primary-700)), rgb(var(--color-primary-600) / 0) 70%);
    transform: translateX(-50%) translateY(50vh);
    opacity: 0.5;
  }
}
</style>