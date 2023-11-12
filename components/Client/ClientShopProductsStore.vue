<template>
  <div>
    <lazy-product-purchase-super-modal
      :state="showPurchaseSuperModal"
      :payload="payload"
      @close="showPurchaseSuperModal = false; payload = {}"
      @submit="onBossPurchaseSubmit"
    />
    <v-expansion-panels>
      <v-expansion-panel @click="onPanelOpen">
        <v-expansion-panel-header color="deep-orange darken-1">
          <h5 class="text-white"><b>Магазин</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            v-if="IS_BOSS"
            label="Клуб продажи"
            v-model="clubId"
            :items="$store.getters['common/CLUBS']"
            item-value="id"
            item-text="name"
          />
          <v-text-field
            label="Поиск"
            v-model="searchShopInput"
            type="search"
            clearable
          />
          <v-data-table
            :items-per-page="-1"
            :loading="isSearching"
            :search="searchShopInput"
            :items="filteredProducts"
            :headers="headers"
            @current-items="getFilteredItems"
          >
            <template v-slot:item.price="{ item }">
             <span :class="[
            item.stock_price ? 'line-through' : ''
          ]">
            {{ item.price | priceFilters }}
          </span><br>
              <span v-if="item.stock_price">
            {{ item.stock_price | priceFilters }}
          </span>
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
  data: () => ({
    panelIndex: -1,
    isPanelOpened: false,
    showPurchaseSuperModal: false,
    payload: {},
  }),
  computed: {
    ...mapGetters({
      products: 'products/shopProducts',
    }),
    resultsCanBeShown() {
      return true;
    },
    filteredProducts() {
      return !!this.resultsCanBeShown ? this.products.map(product => ({
        ...product,
        quantity: this.getQuantity(product)
      })).filter(p => p.quantity > 0) : [];
    }
  },
  methods: {
    async onPanelOpen() {
      if (!this.isPanelOpened) {
        this.$loader.enable();
        if (this.IS_BOSS) {
          await this.$getProducts(this.clubId);
        } else {
          await this.$getProducts(this.$currentClub);
        }
        this.isPanelOpened = true;
        this.$loader.disable();
      }
    },
    getFilteredItems(items) {
      if (items.length === 1) {
        // this._onSubmit(items[0]);
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
