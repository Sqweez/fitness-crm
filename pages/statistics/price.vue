<template>
  <div>
    <t-card-page title="Статистика продаж услуг">
      <t-date-picker
        simple
        v-model="dates"
      />
      <v-autocomplete
        label="Услуги"
        multiple
        :items="mappedServices"
        item-value="id"
        item-text="service_name"
        v-model="selectedServices"
      />
      <v-btn color="indigo" dark :disabled="!hasValidDates" @click="_onSubmit">
        Получить данные
      </v-btn>
      <div v-if="isLoaded">
        <v-list>
          <t-list-item title="Общая стоимость">
            {{ totalItemsAmount | priceFilters }}
          </t-list-item>
        </v-list>
        <v-select
          label="Клуб"
          :items="clubs"
          item-text="name"
          item-value="id"
          v-model="clubId"
        />
        <v-text-field
          v-model="searchItems"
          label="Поиск"
          single-line
          hide-details
        >
          <template v-slot:append>
            <Search :size="20" class="text-gray-400" />
          </template>
        </v-text-field>
        <v-data-table
          :items="filteredItems"
          :search="searchItems"
          :headers="itemsHeaders"
        >
          <template v-slot:item.amount="{ item }">
            {{ item.amount | priceFilters }}
          </template>
        </v-data-table>
        <v-data-table
          :items="total"
          :headers="totalHeaders"
        >
          <template v-slot:item.amount="{ item }">
            {{ item.amount | priceFilters }}
          </template>
        </v-data-table>
      </div>
    </t-card-page>
  </div>
</template>

<script>
import moment from 'moment/moment';
import {mapActions, mapGetters} from 'vuex';
import { Search } from 'lucide-vue';

export default {
  components: { Search },
  async beforeMount() {
    const today = moment().format('YYYY-MM-DD');
    this.dates = [today, today];
    this.$loader.enable('Пожалуйста, подождите...');
    await this.$getServices();
    this.$loader.disable();
  },
  data: () => ({
    dates: [],
    clubId: -1,
    isLoaded: false,
    selectedServices: [],
    items: [],
    searchItems: '',
    total: [],
    searchTotal: '',
    itemsHeaders: [
      {
        value: 'service.name',
        text: 'Услуга'
      },
      {
        value: 'user.name',
        text: 'Сотрудник'
      },
      {
        value: 'client.name',
        text: 'Клиент'
      },
      {
        value: 'amount',
        text: 'Стоимость'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'date',
        text: 'Дата'
      }
    ],
    totalHeaders: [
      {
        value: 'service.name',
        text: 'Услуга'
      },
      {
        value: 'amount',
        text: 'Сумма'
      },
      {
        value: 'count',
        text: 'Количество'
      },
    ]
  }),
  computed: {
    ...mapGetters({
      'services': 'services/SERVICES',
      clubs: 'common/CLUBS_FILTERS',
    }),
    mappedServices() {
      return this.services.map(s => ({
        ...s,
        service_name: `${s.name} (${s.type.name} | ${s.club.name})`
      }))
    },
    hasValidDates() {
      return this.dates.length === 2 && this.dates.every(s => s);
    },
    filteredItems () {
      return this.items.filter(i => {
        return this.clubId === - 1 ? true : i.club.id === this.clubId;
      })
    },
    totalItemsAmount () {
      return this.filteredItems.reduce((a, c) => {
        return a + c.amount;
      }, 0)
    },
  },
  methods: {
    ...mapActions({
      $getServices: 'services/getServices',
    }),
    async _onSubmit() {
      this.$loader.enable();
      const payloadObject = {
        start: this.dates[0],
        finish: this.dates[1]
      };

      if (this.selectedServices.length > 0) {
        payloadObject.services = this.selectedServices;
      }

      const payload = new URLSearchParams(payloadObject)
      const response = await this.$axios.$get(`/v1/stats/price-history?${payload}`);
      this.items = response.items;
      this.total = response.total;
      this.isLoaded = true;
      this.$loader.disable();
    }
  }
}
</script>

<style scoped lang="scss">

</style>
