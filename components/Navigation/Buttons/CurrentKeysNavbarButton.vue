<template>
  <div title="Выданные ключи">
    <button
      @click="$router.push('/keys')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <Key class="text-gray-500" :size="20" />
    </button>
  </div>
</template>

<script>
import { Key } from 'lucide-vue';

export default {
  components: { Key },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
