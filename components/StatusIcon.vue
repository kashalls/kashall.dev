<template>
  <span class="ml-4 is-flex">
    <template v-if="lanyard">
      <b-tooltip position="is-right" type="is-dark">
        <svg height="40" width="24" class="is-inline-block">
          <template v-if="!lanyard.active_on_discord_mobile">
            <rect
              width="24"
              height="24"
              x="0"
              y="0"
              :fill="StatusMap[status]"
              :mask="'url(#svg-mask-status-' + lanyard.discord_status + ')'"
            />
          </template>
          <template v-if="lanyard.active_on_discord_mobile && status === 'online'">
            <rect
              width="24"
              height="36"
              x="0"
              y="0"
              :fill="StatusMap[status]"
              mask="url(#svg-mask-status-mobile)"
            />
          </template>
        </svg>

        <template #content>
          <template v-if="status === 'dnd'">
            Do Not Disturb
          </template>
          <template v-else-if="status === 'online' && lanyard.active_on_discord_mobile">
            Active On Mobile
          </template>
          <template v-else>
            {{ status.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) }}
          </template>
        </template>
      </b-tooltip>
    </template>
    <status-mask />
  </span>
</template>

<script>
import StatusMask from './StatusMask.vue'
const StatusMap = {
  dnd: 'hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)',
  online: 'hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)',
  idle: 'hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%)',
  offline: 'hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)'
}

export default {
  components: { StatusMask },
  props: {
    lanyard: { type: Object, default: () => { return { } } },
    status: { type: String, default: 'offline' }
  },
  data () {
    return {
      StatusMap
    }
  }
}
</script>
