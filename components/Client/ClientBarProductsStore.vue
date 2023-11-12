<template>
  <div>
    <v-expansion-panels class="mt-2" v-model="opened" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header color="red darken-2">
          <h5 class="text-white"><b>Бар</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            label="Поиск"
            v-model="searchBarInput"
            type="search"
            clearable
          />
          <v-data-table
            :search="searchBarInput"
            :items-per-page="-1"
            :loading="isSearching"
            :no-data-text="!search ? 'Начните что-нибудь искать 🤖' : 'Нет результатов 🥲'"
            :items="filteredProducts"
            :headers="headers"
            @current-items="getFilteredItems"
          >
            <template v-slot:item.price="{ item }">
              {{ item.price | priceFilters }}
            </template>
            <template v-slot:item.quantity="{ item }">
              {{ item.quantity }} шт.
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click="_onSubmit(item)" color="success" :disabled="!client">
                Купить
              </v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import useProductSaleMixin from '@/utils/mixins/useProductSaleMixin';
import {mapGetters} from 'vuex';

export default {
  extends: useProductSaleMixin,
  async mounted() {
    await this.$getProducts(this.$currentClub);
  },
  computed: {
    ...mapGetters({
      products: 'products/barProducts',
    }),
    resultsCanBeShown () {
      return true;
    },
    filteredProducts () {
      return !!this.resultsCanBeShown ? this.products.map(product => ({
        ...product,
        quantity: this.getQuantity(product)
      })).filter(p => p.quantity > 0) : [];
    }
  },
}
</script>

<style scoped lang="scss">

</style>
