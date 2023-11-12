<template>
  <div title="Выданные ключи">
    <button
      @click="$router.push('/keys')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <v-icon>
        mdi-key
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
