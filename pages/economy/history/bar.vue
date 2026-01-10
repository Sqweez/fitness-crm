<template>
  <div>
    <t-card-page title="История продаж в баре">
      <t-date-picker
        simple
        v-model="dates"
      />
      <v-btn
        @click="onSubmit"
        color="indigo"
        dark
      >
        Получить отчет
      </v-btn>
      <v-list>
        <t-list-item title="Итого">
          {{ totalAmount | priceFilters }}
        </t-list-item>
      </v-list>
      <v-text-field
        v-model="search"
        label="Поиск"
        single-line
        hide-details
      >
        <template v-slot:append>
          <Search :size="20" class="text-gray-400" />
        </template>
      </v-text-field>
      <v-data-table
        :items-per-page="-1"
        :headers="headers"
        :items="filteredReports"
        :search="search"
      >
        <template v-slot:item.amount="{item}">
          {{ item.amount | priceFilters }}
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';
import moment from 'moment/moment';
import { Search } from 'lucide-vue';

export default {
  name: 'EconomyBarSalesPage',
  components: { Search },
  beforeMount() {
    const today = moment().format('YYYY-MM-DD');
    this.dates = [today, today];
  },
  data: () => ({
    dates: [],
    search: '',
    reports: [],
    headers: [
      {
        value: 'client.name',
        text: 'Клиент'
      },
      {
        value: 'product',
        text: 'Товар'
      },
      {
        value: 'amount',
        text: 'Сумма'
      },
      {
        value: 'user.name',
        text: 'Сотрудник'
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
  }),
  computed: {
    filteredReports () {
      return this.reports;
    },
    totalAmount () {
      return this.filteredReports
        .reduce((a, c) => a + c.amount, 0);
    },
    isDatesValid () {
      return this.dates.length === 2 && this.dates.every(s => !!s);
    },
  },
  methods: {
    async onSubmit () {
      if (!this.isDatesValid) {
        return this.$toast.error('Выберите даты!');
      }
      try {
        this.$loader.enable();
        this.isDataLoaded = false;
        const payload = {
          start: this.dates[0],
          finish: this.dates[1]
        };
        const { data: { data } } = await this.$axios.get(`/v1/economy/my/bar?${new URLSearchParams(payload)}`);
        this.reports = data;
      }
      catch (e) {}
      finally {
        this.$loader.disable();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
