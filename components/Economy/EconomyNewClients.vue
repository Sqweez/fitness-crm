<template>
  <div>
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
      @click:row="(e) => {$router.push(`/clients/${e.client.id}`)}"
    >
      <template v-slot:item.balance="{item}">
        {{ item.balance | priceFilters }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data: () => ({
    search: '',
    headers: [
      {
        value: 'name',
        text: 'Клиент'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'balance',
        text: 'Баланс',
      },
      {
        value: 'registrar.name',
        text: 'Кто создал'
      },
      {
        value: 'date',
        text: 'Дата создания'
      },
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
      reports: 'economy/NEW_CLIENTS',
      clubs: 'common/CLUBS_FILTERS'
    }),
    filteredReports () {
      return this.reports.filter(r => {
        return this.club === -1  ? true : r.club.id === this.club;
      }).filter(r => {
        return this.user === -1 ? true : r.registrar.id === this.user;
      });;
    },
    totalVisits () {
      return this.filteredReports.length;
    },
    totalUniqueVisitors () {
      return new Set(this.filteredReports.map(r => r.client.id)).size;
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
