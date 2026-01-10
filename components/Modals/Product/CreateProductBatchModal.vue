<template>
  <base-modal
    :state="state"
    :max-width="600"
    title="Добавление количества"
    @close="$emit('close')"
  >
    <template #default>
<!--      <v-text-field
        label="Количество"
        v-model.number="quantity"
        type="number"
      />-->
      <h3 v-if="product" class="text-lg font-semibold">
        Товар: {{ product.full_name }}
      </h3>
      <v-text-field
        label="Закупочная стоимость единицы товара"
        v-model.number="purchase_price"
        type="number"
        ref="purchasePriceRef"
      />
<!--      <v-select
        label="Склад"
        :items="clubs"
        item-text="name"
        item-value="id"
        v-model="store_id"
        placeholder="Выберите склад"
        persistent-placeholder
        :disabled="!IS_BOSS"
      />-->
      <div class="flex gap-x-4">
        <div v-for="(batch, key) of batches">
          <p class="font-semibold">{{ batch.name }}</p>
          <v-text-field
            type="number"
            label="Количество"
            v-model="batches[key].quantity"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn color="success" @click="onSubmit" text>
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import userMixin from '@/mixins/userMixin';
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  mixins: [userMixin],
  props: {
    state: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    batches: [],
    quantity: '',
    purchase_price: 0,
    store_id: null,
  }),
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS',
      product: 'products/product'
    })
  },
  beforeMount() {

  },
  methods: {
    ...mapActions({
      $createBatch: 'products/createProductBatch',
    }),
    async onSubmit () {
      try {
        this.$loader.enable();
        await this.$createBatch({
          //quantity: this.quantity,
          purchase_price: this.purchase_price,
          batches: this.batches.filter(b => b.quantity !== null),
          //store_id: this.store_id,
          id: this.product.id,
        });
        this.$emit('close');
      } catch (e) {
        console.log(e);
      } finally {
        this.$loader.disable();
      }
    }
  },
  watch: {
    state (value) {
      this.quantity = 0;
      this.purchase_price = 0;
      this.store_id = null;
      if (!this.IS_BOSS) {
        this.store_id = this.$currentClub;
      }
      this.batches = this.clubs.map(c => ({
        ...c,
        quantity: null
      })).filter(c => {
        return this.IS_BOSS ? true : c.id === this.$currentClub;
      })

      if (value) {
        this.$nextTick(() => {
          if (this.$refs.purchasePriceRef) {
            this.$refs.purchasePriceRef.focus();
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
