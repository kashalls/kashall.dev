<template>
  <a :href="project.url"
    class="max-w-sm p-6 bg-white border border-[#2a4cbe] rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
    <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {{ project.name }}
    </h5>
    <h6 class="mb-2 text-md font-bold tracking-tight text-gray-800 dark:text-white">
      <span>
        <Icon name="carbon:dot-mark" inline="true" :style="`color:` + project.primaryLanguage.color" /> {{
          project.primaryLanguage.name
        }} 
        <template v-if="project.stargazerCount">
          <Icon name="akar-icons:star" inline="true" /> {{ project.stargazerCount }} 
        </template> 
        <template v-if="project.forkCount">
          <Icon name="bx:fork" inline="true" /> {{ project.forkCount }} 
        </template>
      </span>
    </h6>
    <p class="font-normal text-gray-700 dark:text-gray-400">
      {{ project.description.length > 83 ? `${project.description.substring(0, 80)}...` : project.description }}
    </p>
  </a>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {
        return {

        }
      }
    }
  },
  computed: {
    hasForks() {
      return this.project.forkCount === 0 ? false : this.project.forkCount
    }
  }
}
</script>

<style scoped>
.card-max-height {
  max-height: 180px;
  min-height: 180px;
}

.card:hover {
  filter: brightness(120%);
}
</style>
