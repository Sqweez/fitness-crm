<template>
  <div>
    <EconomyShopSalesPage />
    <div class="py-6" />
    <EconomyBarSalesPage />
  </div>
</template>

<script>
import EconomyShopSalesPage from '@/pages/economy/history/sales';
import EconomyBarSalesPage from '@/pages/economy/history/bar';
export default {
  components: {EconomyBarSalesPage, EconomyShopSalesPage},
}
</script>

<style scoped lang="scss">

</style>
