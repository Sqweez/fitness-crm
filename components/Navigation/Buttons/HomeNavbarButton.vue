<template>
  <div title="На домашнюю страницу">
    <button
      aria-label="На домашнюю страницу"
      @click="$router.push('/')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
    >
      <House class="text-black" :size="20" />
    </button>
  </div>
</template>

<script>
import { House } from 'lucide-vue';

export default {
  components: { House },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
