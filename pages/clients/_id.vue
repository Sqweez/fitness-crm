<template>
  <div v-if="CLIENT_LOADED">
    <h2 class="font-medium text-xl mb-4">
      Профиль клиента {{ client.name }} <span class="text-sm">({{ client.club.name }})</span>
    </h2>
    <v-row>
      <v-col lg="3" cols="12">
        <client-side-bar />
      </v-col>
      <v-col lg="9" cols="12">
        <t-card-page title="">
          <div class="flex flex-col gap-y-4">
            <client-birthday v-if="client.is_birthday_today" />
            <client-session v-if="$CAN_OPEN_SESSION && (client.session_can_be_finished || client.trinket_can_given)" />
            <client-purchased-services v-if="$CAN_SEE_PURCHASED_SERVICES" />
            <client-history />
            <client-purchased-solarium v-if="$CAN_SEE_PURCHASED_SERVICES && this._client.total_solarium > 0" />
            <client-services-store v-if="$CAN_SALE_SERVICES"/>
            <client-shop-products-store v-if="$CAN_SALE_PRODUCTS"/>
            <client-bar-products-store v-if="$CAN_SALE_BAR" />
          </div>
        </t-card-page>
      </v-col>
      <balance-modal
        @close="showBalanceModal = false;"
        :state="showBalanceModal"
        :client-id="client.id"
      />
      <v-btn
        v-if="$CAN_TOP_UP_ACCOUNT"
        @click="showBalanceModal = true;"
        elevation="2"
        color="success"
        fixed
        bottom
        right
        fab
        x-large
      >
        <Banknote :size="24" />
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {deepClone} from "@/utils/helpers";
import userMixin from '@/mixins/userMixin';
import { Banknote } from 'lucide-vue';

export default {
  components: { Banknote },
  data: () => ({
    showBalanceModal: false,
  }),
  async mounted () {
    this.$loader.enable('Пожалуйста, подождите...');
    await Promise.all([
      await this.$getClient(this.id),
    ]);
    this.$loader.disable();
  },
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      '_client': 'clients/CLIENT',
      '_services': 'services/SERVICES',
    }),
    client () {
      return deepClone(this._client);
    },
    CLIENT_LOADED() {
      return !!this.$store.getters["clients/CLIENT"] && this.client.id === this.id;
    },
    id () {
      return +this.$route.params.id;
    }
  },
  methods: {
    ...mapActions({
      $getClient: 'clients/getClient',
      $getProducts: 'products/getProducts',
    }),
  }
}
</script>

<style scoped lang="scss">

</style>
