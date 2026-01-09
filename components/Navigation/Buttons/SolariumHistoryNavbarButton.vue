<template>
  <div title="История солярия за сегодня">
    <button
      @click="$router.push('/economy/history/solarium')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <Sun class="text-black" :size="20" />
    </button>
  </div>
</template>

<script>
import { Sun } from 'lucide-vue';

export default {
  components: { Sun },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
