<template>
  <div class="" />
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      errors: {
        400: {
          title: 'Bad Request',
          description: 'That request doesn\'t look so good. Maybe you should go back and try again.'
        },
        401: {
          title: 'Unauthorized',
          description: 'This page requires a fancy smancy authorization token, or maybe yours is invalid...'
        },
        403: {
          title: 'Forbidden',
          description: 'Looks like you shouldn\'t be here anyways.'
        },
        418: {
          title: '418',
          description: 'I\'m a teapot'
        },
        500: {
          title: 'Internal Server Error',
          description: 'Look man, it wasn\'t your fault. It\'s not you, it\'s me. If you believe this is caused by an error on my part, reach out to me.'
        }
      }
    }
  },
  head () {
    return {
      title: `Error ${this.$props.error.statusCode}`
    }
  },
  computed: {
    /**
     * Checks through the common error object and returns the title-description if exists.
     * @returns {{title: string, description: string}} The object that contains error title and description.
     */
    getErrorMeta (title, description) {
      const statusCode = this.error.statusCode
      return {
        title: this.errors[statusCode]?.title || 'Unknown',
        description: this.errors[statusCode]?.description || 'No description.'
      }
    }
  },
  mounted () {
    // eslint-disable-next-line no-console
    console.error(this.$props.error)
  },
  methods: {
    /**
     * Refreshes the page.
     */
    refresh () {
      window.location.reload()
    }
  }
}
</script>
