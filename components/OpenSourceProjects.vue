<template>
  <a :href="project.url">
    <div class="card m-2">
      <div class="card-content card-max-height">
        <div class="media mb-4">
          <div class="media-content">
            <p class="title is-5">{{ project.name }}</p>
            <p class="subtitle is-6">
              <iconify-icon icon="carbon:dot-mark" inline="true" :style="`color:` + project.primaryLanguage.color" /> {{ project.primaryLanguage.name }}
              <template v-if="project.stargazerCount">
                <iconify-icon icon="akar-icons:star" inline="true" /> {{ project.stargazerCount }}
              </template>
              <template v-if="project.forkCount">
                <iconify-icon icon="bx:fork" inline="true" /> {{ project.forkCount }}
              </template>
            </p>
          </div>
        </div>
        <div v-if="project.description" class="content">
          <p>{{ project.description.length > 83 ? `${project.description.substring(0, 80)}...` : project.description }}</p>
        </div>
      </div>
    </div>
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
    hasForks () {
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
