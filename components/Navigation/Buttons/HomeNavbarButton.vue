<template>
  <div title="На домашнюю страницу">
    <button
      @click="$router.push('/')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <v-icon>
        mdi-home
      </v-icon>
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
