<template>
  <Profile />
  <h1 class="flex justify-center dark:text-white text-4xl mt-4">Socials</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 py-6 gap-4 sm:gap-8 xl:gap-12 justify-center">
    <SocialCard v-for="social in socials" :key="social.name" :social="social" />
  </div>
</template>

<script setup>
const socials = [
  {
    name: 'Github',
    username: 'kashalls',
    icon: 'fa-brands:github-alt',
    brand: '#12151A',
    button: {
      description: 'Visit',
      url: 'https://github.com/kashalls'
    },
  },
  {
    name: 'Discord',
    username: 'kashalls',
    icon: 'fa6-brands:discord',
    brand: '#5865F2',
    button: {
      description: 'Follow',
      url: 'https://discordapp.com/users/201077739589992448'
    }
  },
  {
    name: 'LinkedIn',
    username: 'jordpjones',
    icon: 'fa-brands:linkedin-in',
    brand: '#0077B5',
    button: {
      description: 'Visit',
      url: 'https://www.linkedin.com/in/jordpjones/'
    },
  },
  {
    name: 'Twitter',
    username: 'jordpjones',
    icon: 'fa-brands:twitter',
    brand: '#1DA1F2',
    button: {
      description: 'Follow',
      url: 'https://twitter.com/jordpjones'
    }
  }

]
</script>