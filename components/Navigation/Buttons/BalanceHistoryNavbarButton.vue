<template>
  <div title="История пополнений">
    <button
      @click="$router.push('/economy/history/balance')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <Coins class="text-gray-500" :size="20" />
    </button>
  </div>
</template>

<script>
import { Coins } from 'lucide-vue';

export default {
  components: { Coins },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
