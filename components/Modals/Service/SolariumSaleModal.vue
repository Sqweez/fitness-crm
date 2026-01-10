<template>
  <base-modal
    :state="state"
    :max-width="700"
    title="Покупка минут солярия"
    @close="$emit('close')"
  >
    <template #default>
<!--      <v-text-field
        label="Количество"
        v-model="count"
      />-->
      <div class="flex items-center">

        <span class="text-lg font-semibold">Количество приобретаемых минут: {{ minutesTotal }} </span>
        <v-btn icon color="error" @click="decrease">
          <Minus :size="18" />
        </v-btn>
        <v-btn icon color="success" @click="increase">
          <Plus :size="18" />
        </v-btn>
      </div>
      <p
        v-if="!IS_BOSS"
        class="text-lg font-semibold"
      >
        <span >Итого к оплате: {{ totalPrice | priceFilters }}</span>
      </p>
      <div v-if="IS_BOSS">
        <span  class="text-lg font-semibold">Начальная цена: {{ totalPrice | priceFilters }}</span>
        <v-text-field
          label="Итого к оплате"
          v-model="customPrice"
        />
      </div>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text @click="_onSubmit" color="success" v-if="totalPrice > 0">
        Продать <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import userMixin from '@/mixins/userMixin';
import { Minus, Plus, Check } from 'lucide-vue';

export default {
  components: { Minus, Plus, Check },
  mixins: [userMixin],
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    count: 1,
    customPrice: 0,
  }),
  watch: {
    state () {
      this.count = 1;
      this.customPrice = this.totalPrice;
    },
    totalPrice (value) {
      this.customPrice = value;
    }
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT',
    }),
    minutesTotal () {
      return this.service.validity_minutes * this.count;
    },
    price () {
      return this.hasUnlimitedPrice ? this.service.unlimited_price : this.service.price;
    },
    totalPrice () {
      return this.price * this.count;
    },
    hasUnlimitedPrice () {
      return this.client.has_unlimited_discount && this.service.unlimited_price !== this.service.price;
    },
  },
  methods: {
    ...mapActions({
      $createSale: 'clients/createServiceSale',
    }),
    async _onSubmit () {
      const payload = {
        service_id: this.service.id,
        amount: this.IS_BOSS ? this.customPrice : this.totalPrice,
        count: this.count,
        client_id: this.client.id,
        club_id: this.client.club.id,
      };

      if (payload.amount > this.client.balance) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.$loader.enable('Пожалуйста, подождите');
      await this.$createSale(payload);
      this.$loader.disable();
      this.$emit('close');
    },
    decrease () {
       if (this.count !== 1) {
         this.count--;
       }
    },
    increase () {
      this.count++;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
