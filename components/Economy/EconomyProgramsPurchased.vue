<template>
  <div>
    <t-list-item title="Общая сумма покупок">
      {{ totalAmount | priceFilters }}
    </t-list-item>
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
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import { Search } from 'lucide-vue';

export default {
  components: { Search },
  data: () => ({
    search: '',
    headers: [
      {
        value: 'client.name',
        text: 'Клиент'
      },
      {
        value: 'name',
        text: 'Услуга'
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
    clubId: -1,
    userId: -1,
  }),
  props: {
    club: {
      default: -1,
    },
    user: {
      default: -1
    }
  },
  computed: {
    ...mapGetters({
      reports: 'economy/PROGRAMS_PURCHASED',
      clubs: 'common/CLUBS_FILTERS',
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
    }
  },
  methods: {
    loadReport () {

    },
  }
}
</script>

<style scoped lang="scss">

</style>
