<template>
  <section class="section hero-thingy is-align-content-center is-align-items-center is-justify-content-center is-centered">
    <div class="columns is-mobile is-variable is-8 is-flex">
      <div class="column is-3 is-narrow">
        <b-image
          custom-class="avatar"
          alt="Jordan Jones"
          :src="`https://api.lanyard.rest/` + userId + '.gif'"
          rounded
        />
      </div>
      <div class="column">
        <div class="is-flex is-flex-direction-row is-align-items-center">
          <h1 class="title is-1 has-text-white is-inline-block">
            Jordan Jones
          </h1>
          <StatusIcon :status="status" :lanyard="lanyard" />
        </div>
        <h2 class="subtitle is-3 has-text-white">
          <span class="wave mr-2">👋</span>Hey there! I'm Jordan.
        </h2>
        <p class="has-text-white my-4">
          I'm a <span class="has-text-primary">~{{ precisionAgeMs }}</span> year old self-taught web developer in the United States.
        </p>
        <p class="has-text-white my-4">
          Whilst I focus my attention learning how to become a better <a href="https://www.w3schools.com/whatis/whatis_fullstack_js.asp?utm_source=kashall.dev" target="_blank" rel="noreferrer noopener" class="is-underlined has-text-link is-italic">full-stack</a> web developer,<br>
          I have experience with all kinds of different system administor tasks such as Enterprise Networking Management, Phone Systems, Active Directory.
        </p>
        <p class="has-text-white my-4">
          I am currently looking for a position in the <span class="has-text-primary">IT Help Desk</span> field. If you're interesting in hiring me,
          <nuxt-link to="/contact">
            contact me
          </nuxt-link>.
        </p>
        <link-container />
      </div>
    </div>
    <status-mask />
  </section>
</template>

<script>
import LinkContainer from '~/components/LinkContainer.vue'
import StatusIcon from '~/components/StatusIcon.vue'
export default {
  name: 'IndexPage',
  components: { StatusIcon, LinkContainer },
  data () {
    return {
      lanyard: { discord_status: 'offline' },
      lanyardSocket: null,
      userId: '201077739589992448',
      status: 'offline',
      precisionAgeMs: 0,
      timer: null
    }
  },
  watch: {
    'lanyard.discord_status': {
      handler (val) {
        if (!val) {
          return
        }
        this.status = val
      },
      deep: true
    }
  },
  async mounted () {
    this.timer = setInterval(() => {
      this.precisionAge()
    }, 1000)

    this.lanyardSocket = await this.$lanyard({
      userId: this.userId,
      socket: true
    })
    this.lanyardSocket.addEventListener('message', ({ data }) => {
      const { d: status } = JSON.parse(data)
      this.lanyard = status
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.lanyardSocket?.close()
  },
  methods: {
    precisionAge () {
      const bDay = new Date(2000, 6, 24, 2)
      const ageMilliseconds = Date.now() - bDay.getTime()
      this.precisionAgeMs = (ageMilliseconds / 31536000000).toFixed(8)
    }
  }
}
</script>

<style scoped>
.wave {
  animation-name: wave-animation;  /* Refers to the name of your @keyframes element below */
  animation-duration: 2.5s;        /* Change to speed up or slow down */
  animation-iteration-count: infinite;  /* Never stop waving :) */
  transform-origin: 70% 70%;       /* Pivot around the bottom-left palm */
  display: inline-block;
}

@keyframes wave-animation {
    0% { transform: rotate( 0.0deg) }
   10% { transform: rotate(14.0deg) }  /* The following five values can be played with to make the waving more or less extreme */
   20% { transform: rotate(-8.0deg) }
   30% { transform: rotate(14.0deg) }
   40% { transform: rotate(-4.0deg) }
   50% { transform: rotate(10.0deg) }
   60% { transform: rotate( 0.0deg) }  /* Reset for the last half to pause */
  100% { transform: rotate( 0.0deg) }
}
</style>

<style>
.avatar {
  border-radius: 10px;
  object-fit: cover;
  transform: rotate(0deg);
  box-shadow: 0px 5px 10px 2px black;
}
</style>
