<template>
  <template v-if="lanyard">
    <svg height="14" width="14" class="inline align-[unset]">
      <template v-if="!lanyard.active_on_discord_mobile">
        <rect width="14" height="14" x="0" y="0" :fill="StatusMap[status]"
          :mask="'url(#svg-mask-status-' + lanyard.discord_status + ')'" />
      </template>
      <template v-if="lanyard.active_on_discord_mobile && status === 'online'">
        <rect width="14" height="36" x="0" y="0" :fill="StatusMap[status]" mask="url(#svg-mask-status-mobile)" />
      </template>
    </svg>
  </template>
  <status-mask />
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
    lanyard: { type: Object, default: () => { return {} } },
    status: { type: String, default: 'offline' }
  },
  data() {
    return {
      StatusMap
    }
  }
}
</script>
