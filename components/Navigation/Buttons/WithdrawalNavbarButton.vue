<template>
  <div title="Списать средства">
    <button
      @click="showWithDrawalModal = true"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <BanknoteArrowDown class="text-gray-500" :size="20" />
    </button>
    <lazy-with-drawal-modal
      :state="showWithDrawalModal"
      @close="showWithDrawalModal = false"
    />
  </div>
</template>

<script>
import { BanknoteArrowDown } from 'lucide-vue';

export default {
  components: { BanknoteArrowDown },
  data: () => ({
    showWithDrawalModal: false,
  }),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
