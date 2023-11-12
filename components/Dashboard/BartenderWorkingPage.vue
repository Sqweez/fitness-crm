<template>
  <div>
<!--    <t-card-page title="Бар">
      <div class="flex flex-col">
        <div class="flex-1">
          <clients-index-page />
        </div>
        <div class="flex-1">
          <lazy-client-bar-products-store />
        </div>
      </div>
      <div class="mt-4" />
      <products-index-page v-if="isSeniorBartender"/>
    </t-card-page>-->
  </div>
</template>

<script>
import ProductsIndexPage from '@/pages/commerce/products';
import ClientsIndexPage from '@/pages/clients/index';
export default {
  components: {ProductsIndexPage, ClientsIndexPage},
  data: () => ({}),
  computed: {
    isSeniorBartender () {
      return this.$auth.user.roles.some(r => [8].includes(r.id));
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
