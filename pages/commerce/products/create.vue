<template>
  <div>
    <t-card-page title="Создание товара">
      <v-form ref="form">
        <v-text-field
          ref="name"
          label="Наименование"
          v-model.trim="product.name"
          :rules="[() => !!product.name || 'Поле наименование обязательно для заполнения']"
          required
          :error="!!validationErrors.name"
          :error-messages="validationErrors.name"
        />
        <v-text-field
          ref="price"
          label="Стоимость"
          v-model.number="product.price"
          :rules="[() => !!product.price || 'Поле cтоимость обязательно для заполнения']"
          required
          type="number"
          :error="!!validationErrors.price"
          :error-messages="validationErrors.price"
        />
        <v-text-field
          ref="stock_price"
          label="Акционная стоимость"
          v-model.number="product.stock_price"
          required
          type="number"
        />
        <div class="flex items-center gap-x-2">
          <v-autocomplete
            single-line
            ref="product_category_id"
            label="Категория"
            v-model.number="product.product_category_id"
            :rules="[() => !!product.product_category_id || 'Поле категория обязательно для заполнения']"
            required
            :error="!!validationErrors.product_category_id"
            :error-messages="validationErrors.product_category_id"
            :items="categories"
            item-value="id"
            item-text="name"
            placeholder="Выберите категорию"
            persistent-placeholder
            no-data-text="Нет категории"
          />
          <v-btn icon text color="success" @click="showCategoryModal = true">
            <Plus :size="18" />
          </v-btn>
        </div>
        <v-select
          v-show="IS_BOSS"
          label="Тип товара"
          v-model="product.product_type_id"
          :items="types"
          persistent-placeholder
          placeholder="Выберите тип товара"
          item-text="name"
          item-value="id"
          ref="product_type_id"
          :disabled="!IS_BOSS"
        />
        <v-text-field
          ref="barcode"
          label="Штрих-код | Артикул"
          v-model.trim="product.barcode"
          :error="!!validationErrors.barcode"
          :error-messages="validationErrors.barcode"
        />
        <v-text-field
          ref="attribute"
          label="Параметр"
          v-model.trim="product.attribute"
          :error="!!validationErrors.attribute"
          :error-messages="validationErrors.attribute"
        />
        <div class="flex gap-x-4">
          <div v-for="(batch, key) of batches">
            <p class="font-semibold">{{ batch.name }}</p>
            <v-text-field
              label="Количество"
              v-model="batches[key].quantity"
            />
          </div>
        </div>
        <v-btn type="button" color="primary" @click="_onSubmit">
          Создать <Check :size="18" class="ml-1" />
        </v-btn>
      </v-form>
      <lazy-create-category-modal
        :state="showCategoryModal"
        @close="showCategoryModal = false"
        @created="product.product_category_id = $event; showCategoryModal = false;"
      />
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import PRODUCT_TYPES from '@/utils/enums/PRODUCT_TYPES';
import {deepClone} from '@/utils/helpers';
import userMixin from '@/mixins/userMixin';
import { Check, Plus } from 'lucide-vue';

export default {
  mixins: [userMixin],
  components: { Check, Plus },
  data: () => ({
    showCategoryModal: false,
    product: {
      product_category_id: null,
      product_type_id: 1,
    },
    validationErrors: {},
    types: PRODUCT_TYPES,
    batches: [],
  }),
  computed: {
    ...mapGetters({
      categories: 'products/categories',
      savedProduct: 'products/product',
      clubs: 'common/CLUBS'
    }),
    form () {
      return {
        name: this.product.name,
        price: this.product.price,
        product_category_id: this.product.product_category_id,
        product_type_id: this.product.product_type_id,
        //stock_price: this.product.stock_price,
      }
    },
  },
  beforeMount() {
    if (this.savedProduct) {
      this.product = deepClone(this.savedProduct);
    }
    if (this.IS_BARTENDER) {
      this.product.product_type_id = 2;
    }
    this.batches = this.clubs.map(c => ({
      ...c,
      quantity: null
    })).filter(c => {
      return this.IS_BOSS ? true : c.id === this.$currentClub;
    });
  },
  mounted() {
    this.$refs.name.focus();
  },
  beforeDestroy() {
    this.$store.commit('products/setProduct', null);
  },
  methods: {
    ...mapActions({
      $createProduct: 'products/createProduct'
    }),
    _validateForm () {
      let errors = [];
      this.validationErrors = {};
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) errors.push(true);
        this.$refs[f].validate(true);
      })
      return errors.length === 0;
    },
    async _onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        this.$loader.enable('Идет создание товара...');
        await this.$createProduct({
          ...this.product,
          batches: this.batches
            .filter(b => b.quantity)
            .map(b => ({store_id: b.id, quantity: b.quantity})),
        });
        if (this.IS_BOSS) {
          await this.$router.push('/commerce/products')
        } else {
          await this.$router.push('/');
        }
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
