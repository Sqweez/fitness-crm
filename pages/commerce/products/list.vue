<template>
  <div>
    <t-card-page title="Наличие товара">
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
      <v-checkbox
        label="Скрыть отсутствующие"
        v-model="hideNotInstock"
      />
      <v-checkbox
        label="Только акционные товары"
        v-model="onlyStocks"
      />
      <v-data-table
        :items-per-page="-1"
        :loading="isSearching"
        :search="searchShopInput"
        :items="filteredProducts"
        :headers="headers"
        @current-items="getFilteredItems"
      >
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
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
        <template v-slot:top="{ pagination, options, updateOptions }">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
        </template>
<!--        <template v-slot:item.actions="{ item }">
          <v-btn @click="_onSubmit(item)" color="success" :disabled="!client">
            Купить
          </v-btn>
        </template>-->
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import useProductSaleMixin from '@/utils/mixins/useProductSaleMixin';
import {mapGetters} from 'vuex';

export default {
  extends: useProductSaleMixin,
  data: () => ({
    hideNotInstock: false,
    onlyStocks: false,
    panelIndex: -1,
    isPanelOpened: false,
    headers: [
      {
        value: 'ordinal',
        text: '#'
      },
      {
        value: 'full_name',
        text: 'Наименование'
      },
      {
        value: 'price',
        text: 'Стоимость'
      },
      {
        value: 'category.name',
        text: 'Категория'
      },
      {
        value: 'barcode',
        text: 'Штрих-код | Артикул'
      },
      {
        value: 'quantity',
        text: 'Остаток'
      },
    ],
  }),
  async mounted() {
    await this.onPanelOpen();
  },
  computed: {
    ...mapGetters({
      products: 'products/shopProducts',
    }),
    resultsCanBeShown () {
      return true;
    },
    filteredProducts () {
      return !!this.resultsCanBeShown ? this.products.map(product => ({
        ...product,
        quantity: this.getQuantity(product)
      })).filter(p => {
        return this.hideNotInstock ? p.quantity > 0 : true;
      }).filter(product => {
        return this.onlyStocks ? product.stock_price : true;
      }) : [];
    }
  },
  methods: {
    async onPanelOpen () {
      if (!this.isPanelOpened) {
        this.$loader.enable();
        if (this.IS_BOSS) {
          await this.$getProducts();
        } else {
          await this.$getProducts(this.$currentClub);
        }
        this.isPanelOpened = true;
        this.$loader.disable();
      }
    },
    getFilteredItems (items) {
      if (items.length === 1) {
        this._onSubmit(items[0]);
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
