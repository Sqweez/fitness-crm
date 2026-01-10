<template>
  <div>
    <Check v-if="state" class="text-green-500" :size="20" />
    <X v-else class="text-red-500" :size="20" />
  </div>
</template>

<script>
import { Check, X } from 'lucide-vue';

export default {
  components: { Check, X },
  props: {
    state: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">

</style>
