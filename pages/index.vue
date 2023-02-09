<template>
  <header class="relative flex flex-col w-full py-44 items-center justify-center overflow-hidden h-screen top-0 -mt-16">
    <h1
      class="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
      Hey there! I'm <span class="animate-[wiggle_1s_ease-in-out_infinite]">Kashall</span>.
    </h1>
    <div
      class="xl:px-20 lg:pl-16 mx-auto px-6 pt-16 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">

      <div class="grid grid-cols-1 md:grid-cols-2 [>div]:my-auto gap-20">
        <div class="h-full">
          <h2 class="text-4xl font-extrabold dark:text-white">Who Is I?</h2>
          <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">I'm a self-taught developer based in
            California whose aspiring to work
            as a Systems Administrator in the future.</p>

          <p class="text-md font-normal text-gray-800 dark:text-gray-700">I currently work for:</p>
          <h3 class="title-font sm:text-xl text-lg font-medium text-gray-900 dark:text-gray-300">
            Systems Admin at <a href="https://zandercraft.ca/" class="hover:text-gray-500">Zandercraft</a>
          </h3>
          <h3 class="title-font sm:text-xl text-lg font-medium text-gray-900 dark:text-gray-300">
            Systems Integrator at <a href="https://www.pjltelecom.com/" class="hover:text-gray-500">PJL
              Telecom</a>
          </h3>

          <div class="flex space-x-4 mt-8 animate-[fadeInDown_1.2s_ease_800ms_backwards]">
            <NuxtLink to="/contact">
              <button type="button"
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                Print Me A Note
                <Icon name="ic:round-keyboard-arrow-right" />
              </button>
              <button type="button"
                class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                <Icon name="ic:sharp-contact-page" /> Contact Me
              </button>
            </NuxtLink>
          </div>

        </div>
        <div class="md:flex flex-col">

          <div class="shadow-lg w-full">
            <div
              class="border-[1.5px] border-zinc-300/5 shadow-xl rounded-lg bg-gradient-to-tr from-[#1a1721] to-[#100e15] h-60">
              <div class="p-3 [&>svg]:w-10 border-b-[1.5px] border-b-zinc-600/50 justify-between flex">
                <svg viewBox="0 0 52 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="46" cy="6" r="6" fill="#5FCF65"></circle>
                  <circle cx="26" cy="6" r="6" fill="#F8CE52"></circle>
                  <circle cx="6" cy="6" r="6" fill="#F96057"></circle>
                  <circle cx="6" cy="6" r="5.75" stroke="black" stroke-opacity="0.1" stroke-width="0.5"></circle>
                  <circle cx="26" cy="6" r="5.75" stroke="black" stroke-opacity="0.1" stroke-width="0.5"></circle>
                  <circle cx="46" cy="6" r="5.75" stroke="black" stroke-opacity="0.1" stroke-width="0.5"></circle>
                </svg>
                <p class="text-white text-sm">Kashall's Terminal</p>
                <p />
              </div>
              <div class="font-mono text-sm">
                <ClientOnly>
                  <VueCommand :commands="commands" title="Kashall's Terminal" hide-bar="true" :help-text="helpText"
                    :help-timeout="helpTimeout" :show-help="showHelp" />
                  <Turnstile ref="turnstile" v-model="TurnstileToken" />
                </ClientOnly>
              </div>
            </div>
          </div>
          <DiscordPresence :presence="lanyard" />
        </div>
      </div>
    </div>
  </header>
  <div class="w-full h-[1px] bg-zinc-600"></div>
  <div
    class="py-28 xl:px-20 lg:pl-16 mx-auto px-6 pt-8 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
    <h2
      class="mb-4 text-center text-xl md:text-[3.4em] font-medium !leading-[1.2] bg-clip-text text-transparent bg-gradient-text bg-gradient-to-b from-white to-zinc-400">
      Pinned Repositories
    </h2>
    <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      <OpenSourceProjects v-for="project in pinned.data" :key="project.name" :project="project" />
    </div>
  </div>
</template>

<script setup>
import VueCommand, { createStdout, listFormatter } from "vue-command";
import { useLanyard } from "@leonardssh/use-lanyard";
import "vue-command/dist/vue-command.css";
const { public: { PINNED_REPOSITORIES_URL, DISCORD_USER_ID, PRINT_SERVER } } = useRuntimeConfig()
const { data: pinned } = await useFetch(PINNED_REPOSITORIES_URL)

const lanyard = ref()
if (process.client) {
  useLanyard({
    userId: DISCORD_USER_ID,
    socket: true,
    onPresenceUpdate(presence) {
      lanyard.value = presence
    }
  })
}
const prompt = 'kashall@senko ~ $'
const showHelp = true
const helpText = 'Type "help" for help'
const helpTimeout = 3500

const turnstile = ref()
const TurnstileToken = ref()
console.log(turnstile.value)

const terminalCommands = [
  {
    name: 'help',
    description: 'A list of commands that you can use.',
    run: () => {
      const list = []
      terminalCommands.forEach((cmd) => {
        list.push(`${cmd.name} — ${cmd.description}`)
      })
      return createStdout(listFormatter(...list))
    }
  },
  {
    name: 'ping',
    description: 'Pong?',
    run: () => {
      console.log(TurnstileToken.value)
      return createStdout('Pong!')
    }
  },
  {
    name: 'whoami',
    description: 'I am Yu.',
    run: () => {
      return createStdout('kashall')
    }
  },
  {
    name: 'contact-me',
    description: 'More ways than one to find me on platforms you are on.',
    run: () => {
      return navigateTo('/contact')
    }
  },
  {
    name: 'sponsor-me',
    description: 'Help me discover what I am truly passionate about.',
    run: () => {
      return navigateTo('/sponsor')
    }
  },
  {
    name: 'print',
    description: 'Once every 12 hours, you can send me a note! It gets printed in real-time!',
    run: async (parsedArguments) => {
      parsedArguments.shift()
      if (parsedArguments[0].toLowerCase() === 'help') {
        return createStdout('Usage: print [...message]\n\nUse \\n to denote a line-break (limit: 1).')
      }
      const message = parsedArguments.join(' ')

      const printReport = await $fetch(PRINT_SERVER, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ message, token: TurnstileToken.value })
      }).catch((error) => {
        console.log(error)
        return createStdout('Errored :(')
      })

      console.log(printReport)
      return createStdout('Thanks for your message!\nIf urgency is required, consider emailing me at pm@kashall.dev')
    }
  }
]

const commands = computed(() => {
  const list = {}
  terminalCommands.forEach((cmd) => {
    list[cmd.name] = cmd.run
  })
  return list
})

</script>

<style lang="scss">
.vue-command,
.vue-command--invert {
  width: 100%;

  ::-webkit-scrollbar {
    width: 6px;
  }

  .vue-command__bar,
  .vue-command__bar--invert {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .vue-command__history,
  .vue-command__history--invert {
    height: 12rem;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
}

.vue-command {
  ::-webkit-scrollbar-track {
    background: #252525;
  }

  ::-webkit-scrollbar-thumb {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
}

.vue-command--invert {
  ::-webkit-scrollbar-track {
    background: #dadada;
  }

  ::-webkit-scrollbar-thumb {
    background: #0e0e0e;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #cccccc;
  }
}

.vue-command .vue-command__bar,
.vue-command .vue-command__history {
  background-color: transparent;
}
</style>