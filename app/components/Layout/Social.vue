<template>
    <div class="">
        <UButton v-for="social in socials" :key="social.to" :icon="social.iconFill" :to="social.to" :aria-label="social.label" size="xs" color="primary"
            variant="ghost" />
    </div>


</template>