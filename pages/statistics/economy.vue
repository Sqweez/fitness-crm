<template>
  <div class="flex flex-col gap-y-6">
    <lazy-economy-date-stats />
    <lazy-economy-client-balance-stats />
    <lazy-economy-common-stats />
  </div>
</template>

<script>
import isBossMiddleware from '@/middleware/isBossMiddleware';

export default {
  middleware: [isBossMiddleware],
}
</script>

<style scoped lang="scss">

</style>
