<template>
  <div>
    <t-card-page title="Товары">
      <v-btn
        @click="$router.push('/commerce/products/create')"
        color="primary"
        dark
      >
        Добавить
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-row>
        <v-col>
          <v-select
            label="Категория"
            v-model="categoryId"
            :items="categories"
            item-value="id"
            item-text="name"
          />
        </v-col>
        <v-col>
          <v-select
            v-show="IS_BOSS"
            label="Тип"
            v-model="productTypeId"
            :items="types"
            item-value="id"
            item-text="name"
          />
        </v-col>
        <v-col>
          <v-select
            label="Фильтр по количеству"
            v-model="quantityFilter"
            :items="quantityFilters"
            item-text="name"
            item-value="id"
          />
        </v-col>
        <v-col>
          <v-checkbox
            label="Только акционные товары"
            v-model="onlyStocks"
          />
        </v-col>
      </v-row>
      <v-text-field
        label="Поиск"
        v-model="search"
        type="search"
        clearable
        ref="searchInput"
      />
      <v-data-table
        :items-per-page="10"
        :search="search"
        :items="filteredProducts"
        :headers="headers"
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
          <v-list>
            <t-list-item
              :title="q.name"
              :key="`${item.id}-${q.club_id}`"
              v-for="q of item.quantity"
            >
              {{ q.quantity }} шт.
            </t-list-item>
          </v-list>
        </template>
        <template v-slot:top="{ pagination, options, updateOptions }">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
        </template>
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="flex flex-col gap-y-1">
            <v-btn color="success" small @click="openCreateSameProductPage(item)">
              Родственный товар <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn color="blue darken-1" small @click="openEditPage(item)" dark>
              Редактировать <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="purple darken-1" small @click="openBatchModal(item)" dark>
              Количество <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn color="orange darken-1" small @click="getProductBatchInformation(item.id)" dark>
              История пополнений <v-icon>mdi-information-outline</v-icon>
            </v-btn>
            <v-btn color="error" small @click="deleteProduct(item)">
              Удалить <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </t-card-page>
    <lazy-create-product-batch-modal
      :state="showProductBatchModal"
      @close="closeBatchModal"
    />
    <lazy-product-batch-information-modal
      :state="showProductBatchInformationModal"
      :information="productBatchInformation"
      @close="showProductBatchInformationModal = false; productBatchInformation = [];"
    />
  </div >
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import PRODUCT_TYPES from '@/utils/enums/PRODUCT_TYPES';
import userMixin from '@/mixins/userMixin';

export default {
  name: 'products-index-page',
  mixins: [userMixin],
  data: () => ({
    onlyStocks: false,
    showProductBatchModal: false,
    showProductBatchInformationModal: false,
    search: '',
    productTypeId: -1,
    categoryId: -1,
    productBatchInformation: [],
    quantityFilter: -1,
    quantityFilters: [
      {
        id: -1,
        name: 'Показать все'
      },
      {
        id: 0,
        name: 'Скрыть отсутствующие'
      },
      {
        id: 1,
        name: 'Показать только отсутствующие'
      },
    ],
  }),
  computed: {
    ...mapGetters({
      categories: 'products/categoryFilters',
      products: 'products/products'
    }),
    types () {
      return [
        {
          id: -1,
          name: 'Все'
        },
        ...PRODUCT_TYPES
      ]
    },
    filteredProducts () {
      return this.products.filter(p => {
        return this.categoryId === - 1 ? true : p.category.id === this.categoryId
      }).filter(p => {
        return this.productTypeId === -1 ? true : p.product_type_id === this.productTypeId;
      }).filter(p => {
        if (this.quantityFilter === -1) {
          return true;
        }
        if (this.quantityFilter === 0) {
          return p.not_in_stock === false;
        }
        return p.not_in_stock === true;
      }).filter(product => {
        return this.onlyStocks ? product.stock_price : true;
      })
    },
    headers () {
      const headers =  [
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
          value: 'product_type',
          text: 'Тип'
        },
        {
          value: 'barcode',
          text: 'Штрих-код | Артикул'
        },
        {
          value: 'quantity',
          text: 'Остаток'
        },
      ];

      if (this.IS_BOSS || this.IS_SENIOR_BARTENDER) {
        headers.push({
          value: 'actions',
          text: 'Действие'
        });
      }

      return headers;
    }
  },
  async beforeMount() {
    this.$loader.enable();
    if (this.IS_BOSS) {
      await this.$getProducts();
    } else {
      await this.$getProducts(this.$currentClub);
    }
    if (this.IS_BARTENDER) {
      this.productTypeId = 2;
    } else {
      this.productTypeId = 1;
    }
    this.$loader.disable();
  },
  mounted() {
    this.$refs.searchInput.focus();
  },
  methods: {
    ...mapActions({
      $getProducts: 'products/getProducts',
      $deleteProduct: 'products/deleteProduct',
      $getProductBatchInformation: 'products/getProductBatchInformation',
    }),
    async getProductBatchInformation (productId) {
      this.$loader.enable();
      this.productBatchInformation = await this.$getProductBatchInformation(productId);
      this.showProductBatchInformationModal = true;
      this.$loader.disable();
    },
    openBatchModal (product) {
      this.$store.commit('products/setProduct', product);
      this.showProductBatchModal = true;
    },
    openEditPage (product) {
      this.$store.commit('products/setProduct', product);
      this.$router.push(`/commerce/products/${product.id}`)
    },
    closeBatchModal () {
      this.showProductBatchModal = false;
      this.$store.commit('products/setProduct', null);
    },
    openCreateSameProductPage (product) {
      this.$store.commit('products/setProduct', product);
      this.$router.push(`/commerce/products/create`);
    },
    async deleteProduct (product) {
      this.$confirm(`Вы действительно хотите удалить выбранный товар?`)
        .then(async () => {
          await this.$deleteProduct(product.id);
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
