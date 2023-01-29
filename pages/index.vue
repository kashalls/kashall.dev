<template>
    <section class="body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div
                class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <h1 class="title-font sm:text-4xl text-3xl font-medium text-gray-900 dark:text-gray-100">Jordan
                    Jones</h1>
                <h3 class="title-font sm:text-xl text-lg mb-4 font-medium text-gray-900 dark:text-gray-100">Systems
                    Administrator & Software Engineer</h3>
                <div class="grid lg:grid-cols-2">
                    <a v-for="link in hotlinks" :key="link.name" :href="link.link"
                        class="text-gray-400 hover:text-gray-500 font-bold text-lg">
                        {{ link.name }}
                    </a>
                </div>
                <h3 class="title-font sm:text-xl text-lg mt-4 font-medium text-gray-900 dark:text-gray-300">
                    Systems Admin at <a href="https://zandercraft.ca/" class="hover:text-gray-500">Zandercraft</a>
                </h3>
                <h3 class="title-font sm:text-xl text-lg font-medium text-gray-900 dark:text-gray-300">
                    Systems Integrator at <a href="https://www.pjltelecom.com/" class="hover:text-gray-500">PJL
                        Telecom</a>
                </h3>
            </div>

            <FrontServerView />
        </div>
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <p>Hello</p>
            <DiscordCard />
        </div>
    </section>
</template>

<script setup>
const hotlinks = [
    {
        name: 'Kashall#0001',
        link: 'https://kashall.dev/discord'
    },
    {
        name: 'pm@kashall.dev',
        link: 'mailto:pm@kashall.dev'
    },
    {
        name: '@kashall@mastodon.social',
        link: 'https://mastodon.social/@kashall'
    },
]

</script>