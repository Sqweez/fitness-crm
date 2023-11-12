<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel >
        <v-expansion-panel-header color="lime darken-2">
          <h5 class="text-white"><b>Прайс-лист:</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-expansion-panels class="mt-4 mb-2">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h5><b>Фильтры:</b></h5>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-select
                  :items="clubs"
                  v-model="clubId"
                  item-value="id"
                  item-text="name"
                  label="Клуб"
                  :disabled="!user.is_boss"
                />
                <v-select
                  :items="types"
                  v-model="typeId"
                  item-value="id"
                  item-text="name"
                  label="Тип"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-text-field
            v-model="serviceSearch"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-data-table
            :headers="serviceHeaders"
            :items="filteredServices"
            :search="serviceSearch"
            :items-per-page="-1"
          >
            <template v-slot:item.price="{item}">
              <span v-if="!hasUnlimitedPrice(item)">{{ item.price | priceFilters }}</span>
              <span v-else>
                <span class="line-through">{{ item.price | priceFilters }}</span>
                <span>{{ item.unlimited_price | priceFilters }}</span>
              </span>
            </template>
            <template v-slot:item.prolongation_price="{item}">
              {{ item.prolongation_price | priceFilters }}
            </template>
            <template v-slot:item.extra="{item}">
              <v-list>
                <t-list-item title="Количество посещений" v-if="item.type.id === 3">
                  {{ item.entries_count }}
                </t-list-item>
                <t-list-item title="Срок действия (дней)" v-if="item.validity_days">
                  {{ item.validity_days }}
                </t-list-item>
                <t-list-item title="Срок действия (минут)" v-if="item.type.id === 2">
                  {{ item.validity_minutes }}
                </t-list-item>
                <t-list-item title="Стоимость для безлимитчиков" v-if="item.unlimited_price !== 0 && item.unlimited_price !== item.price">
                  {{ item.unlimited_price | priceFilters }}
                </t-list-item>
                <t-list-item title="Стоимость пролонгации" v-if="item.prolongation_price !== 0 && item.prolongation_price !== item.price">
                  {{ item.prolongation_price | priceFilters }}
                </t-list-item>
                <t-list-item title="Стоимость восстановления" v-if="item.restore_price !== 0">
                  {{ item.restore_price | priceFilters }}
                </t-list-item>
              </v-list>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click="_onSubmit(item)" color="success">
                Купить
              </v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <solarium-sale-modal :state="showSolariumModal" :service="service" @close="showSolariumModal = false; service = {}" />
    <lazy-service-purchase-super-modal
      :state="showPurchaseModal"
      :payload="payload"
      @close="showPurchaseModal = false; payload = {}"
      @submit="onBossPurchaseSubmit"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  data: () => ({
    showPurchaseModal: false,
    clubId: -1,
    typeId: -1,
    serviceHeaders: [
      {
        value: 'id',
        text: 'id',
        align: ' hidden'
      },
      {
        value: 'name',
        text: 'Название'
      },
      {
        value: 'type.name',
        text: 'Тип'
      },
      {
        value: 'price',
        text: 'Стоимость'
      },
      {
        value: 'validity_days',
        text: 'Количество дней'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      /*{
        value: 'extra',
        text: 'Доп информация'
      },*/
      {
        value: 'actions',
        text: 'Действие'
      }
    ],
    serviceSearch: '',
    showSolariumModal: false,
    service: {},
    payload: {},
    panel: [0]
  }),
  async mounted () {
    await this.$getServices();
    this.clubId = this.user.is_boss ? -1 : this.user.club.id;
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT',
      types: 'common/SERVICE_TYPES_FILTER',
      clubs: 'common/CLUBS_FILTERS',
      _services: 'services/SERVICES',
      user: 'user/$user',
    }),
    filteredServices () {
      return this._services.filter(s => {
        return this.clubId === -1 ? true : s.club.id === this.clubId;
      }).filter(s => {
        return this.typeId === -1 ? true : s.type.id === this.typeId;
      })
    },
  },
  methods: {
    ...mapActions({
      $getServices: 'services/getServices',
      $createSale: 'clients/createServiceSale',
      $getProducts: 'products/getProducts',
    }),
    hasUnlimitedPrice (item) {
      return this.client.has_unlimited_discount && item.unlimited_price !== item.price && item.unlimited_price !== 0;
    },
    getFinalPrice (item) {
      return this.hasUnlimitedPrice(item) ? item.unlimited_price : item.price;
    },
    async _onSubmit (service) {
      if (service.type.id === 2) {
        this.service = service;
        this.showSolariumModal = true;
        return true;
      }

      const payload = {
        club_id: service.club.id,
        client_id: this.client.id,
        service_id: service.id,
        amount: this.getFinalPrice(service),
        self_name: service.name,
        name: service.name,
      };

      if (this.IS_BOSS) {
        this.payload = payload;
        this.showPurchaseModal = true;
        return;
      }

      if (this.client.balance < payload.amount) {
        return this.$toast.error('Недостаточно средств!');
      }

      this.$confirm(`Вы действительно хотите продать услугу ${service.name}?`)
        .then(_ => {
          this.$loader.enable('Пожалуйста, подождите');
          this.$createSale(payload);
          this.$loader.disable();
          this.$getProducts(this.client.club.id);
        })
    },
    async onBossPurchaseSubmit (payload) {
      if (this.client.balance < payload.amount) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.showPurchaseModal = false;
      this.payload = {};
      this.$loader.enable('Пожалуйста, подождите');
      await this.$createSale(payload);
      this.$loader.disable();
    },
  }
}
</script>

<style scoped lang="scss">

</style>
