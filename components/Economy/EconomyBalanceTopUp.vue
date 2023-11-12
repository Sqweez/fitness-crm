<template>
  <div>
    <v-list>
      <div class="flex gap-x-2">
        <v-list>
          <t-list-item title="Общая сумма пополнений">
            {{ totalAmount | priceFilters }}
          </t-list-item>
        </v-list>
        <v-list>
          <t-list-item title="Общая сумма наличные">
            {{ totalCash | priceFilters }}
          </t-list-item>
        </v-list>
        <v-list>
          <t-list-item title="Общая сумма безналичные">
            {{ totalCashless | priceFilters }}
          </t-list-item>
        </v-list>
      </div>
    </v-list>
    <v-select
      label="Клуб"
      :items="clubs"
      item-text="name"
      item-value="id"
      v-model="clubId"
    />
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Поиск"
      single-line
      hide-details
    ></v-text-field>
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
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {__hardcoded} from '@/utils/helpers';

export default {
  data: () => ({
    search: '',
    clubId: -1,
    headers: [
      {
        value: 'client.name',
        text: 'Клиент'
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
  props: {
    club: {
      default: -1,
    },
    user: {
      default: -1,
    }
  },
  computed: {
    ...mapGetters({
      reports: 'economy/ACCOUNTS_TOP_UPS',
      clubs: 'common/CLUBS_FILTERS'
    }),
    filteredReports () {
      return this.reports.filter(r => {
        return this.club === -1  ? true : r.club.id === this.club;
      }).filter(r => {
        return this.user === -1 ? true : r.user.id === this.user;
      });
    },
    totalAmount () {
      return this.filteredReports.reduce((a, c) => a + c.amount, 0);
    },
    totalCash () {
      return this.filteredReports.filter(f => f.payment_type === __hardcoded(1)).reduce((a, c) => a + c.amount, 0);
    },
    totalCashless () {
      return this.filteredReports.filter(f => f.payment_type === __hardcoded(2)).reduce((a, c) => a + c.amount, 0);
    },
  },
  methods: {
    loadReport () {

    },
  }
}
</script>

<style scoped lang="scss">

</style>
