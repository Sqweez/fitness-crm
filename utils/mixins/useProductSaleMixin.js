import {mapActions, mapGetters, mapMutations} from 'vuex';
import {__debounce, __hardcoded} from '@/utils/helpers';
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  data: () => ({
    clubId: 1,
    opened: [0],
    isSearching: false,
    searchShopInput: '',
    searchBarInput: '',
    search: '',
    headers: [
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
      {
        value: 'actions',
        text: 'Действие'
      }
    ],
  }),
  computed: {
    resultsCanBeShown () {
      return !!this.search && !this.isSearching;
    },
    ...mapGetters({
      categories: 'products/categoryFilters',
      client: 'clients/CLIENT',
    }),
    isProductsLoaded () {
      return this.products.length === 0;
    },
    filteredProducts () {
      return !!this.resultsCanBeShown ? this.products.map(product => ({
        ...product,
        quantity: this.getQuantity(product)
      })).filter(p => p.quantity > 0) : [];
    }
  },
  methods: {
    ...mapActions({
      $createSale: 'clients/createProductSale',
      $searchProduct: 'products/searchProducts',
      $getProducts: 'products/getProducts',
    }),
    ...mapMutations({
      $updateProduct: 'products/updateProduct'
    }),
    async onBossPurchaseSubmit (payload) {
      if (this.client.balance < payload.amount) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.showPurchaseSuperModal = false;
      this.payload = {};
      this.$loader.enable('Пожалуйста, подождите');
      const _payload = {
        club_id: this.IS_BOSS ? this.clubId : this.$currentClub,
        client_id: this.client.id,
        product_id: payload.id,
        amount: payload.price,
      };
      const product = await this.$createSale(_payload);
      this.$updateProduct(product);
      this.$loader.disable();
    },
    getQuantity (item) {
      const clubId = !this.IS_BOSS ? this.$currentClub : this.clubId;
      const needle = item.quantity.find(q => q.club_id === clubId);
      return needle ? needle.quantity : 0;
    },
    getFilteredItems (items) {
      if (items.length === 1) {
        this._onSubmit(items[0]);
      }
    },
    async _onSubmit (product) {
      if (this.IS_BOSS) {
        this.payload = {
          ...product,
          price: product.stock_price ? product.stock_price : product.price,
        };
        this.showPurchaseSuperModal = true;
        return;
      }
      if (!this.client) {
        return;
      }
      if (this.client.balance < product.price) {
        return this.$toast.error('Недостаточно средств!');
      }

      if (product.quantity < 1) {
        return this.$toast.error('Товар отсутствует в продаже!');
      }

      this.searchShopInput = '';
      this.searchBarInput = '';

      const payload = {
        club_id: this.IS_BOSS ? this.clubId : this.$currentClub,
        client_id: this.client.id,
        product_id: product.id,
        amount: product.price,
      };

      this.$confirm(`Вы действительно хотите продать позицию "${product.full_name}"?`)
        .then(async _ => {
          this.$loader.enable('Пожалуйста, подождите');
          const product = await this.$createSale(payload);
          this.$updateProduct(product);
          this.$loader.disable();
        })
    },
    async onSearch () {
      this.isSearching = true;
      const type = this.searchShopInput ? __hardcoded(1) : __hardcoded(2);
      const store_id = this.IS_BOSS ? this.clubId : this.$currentClub;
      await this.$searchProduct({search: this.search, type, store_id});
      this.isSearching = false;
    },
  },
  watch: {
    clubId: {
      immediate: true,
      handler: async function (val) {
        this.$loader.enable()
        await this.$getProducts(val);
        this.$loader.disable();
      }
    },
    /*searchShopInput: __debounce(function (newValue) {
      this.search = newValue;
    }),*/
   /* searchBarInput: __debounce(function (newValue) {
      this.search = newValue;
    }),*/
    async search (value) {
      if (!value || value.length < 2 || this.isSearching) {
        return null;
      }
      await this.onSearch();
    }
  }
}
