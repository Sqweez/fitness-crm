<template>
  <div>
    <t-card-page title="История магазина">
      <div v-if="IS_BOSS">
        <v-select
          v-if="IS_BOSS"
          label="Клуб продажи"
          v-model="clubId"
          :items="[{id: -1, name: 'Все'}, ...$store.getters['common/CLUBS']]"
          item-value="id"
          item-text="name"
        />
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
      </div>
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
import userMixin from '@/mixins/userMixin';
import moment from 'moment';
import { Search } from 'lucide-vue';

export default {
  name: 'EconomyShopSalesPage',
  mixins: [userMixin],
  components: { Search },
  data: () => ({
    clubId: -1,
    search: '',
    dates: [],
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
  beforeMount() {
    const today = moment().format('YYYY-MM-DD');
    this.dates = [today, today];
  },
  async mounted() {
    await this.onSubmit();
  },
  computed: {
    filteredReports () {
      return this.reports.filter(r => {
        return this.clubId === -1 ? true : r.club.id === this.clubId;
      });
    },
    totalAmount () {
      return this.filteredReports
        .reduce((a, c) => a + c.amount, 0);
    },
  },
  methods: {
    async onSubmit () {
      this.$loader.enable();
      const payload = this.dates.length === 2 ? new URLSearchParams({
        start: this.dates[0],
        finish: this.dates[1]
      }) : '';
      const { data: { data } } = await this.$axios.get(`/v1/economy/my/sales?${payload}`);
      this.reports = data;
      this.$loader.disable();
    },
  }
}
</script>

<style scoped lang="scss">

</style>
