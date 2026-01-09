<template>
  <div title="Закладка клиентов">
    <button
      @click="$router.push('/bookmarks')"
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
      aria-haspopup="true"
    >
      <Bookmark class="text-gray-500" :size="20" />
    </button>
  </div>
</template>

<script>
import { Bookmark } from 'lucide-vue';

export default {
  components: { Bookmark },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
