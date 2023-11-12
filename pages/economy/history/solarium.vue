<template>
  <div>
    <t-card-page title="История солярия за день">
      <t-list-item title="Итого, минут">
        {{ totalSolarium }}
      </t-list-item>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="filteredReports"
        :search="search"
        :items-per-page="-1"
      >
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';

export default {
  data: () => ({
    search: '',
    reports: [],
    headers: [
      {
        value: 'client.name',
        text: 'Клиент'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'user.name',
        text: 'Пользователь'
      },
      {
        value: 'minutes',
        text: 'Длительность (мин)'
      },
      {
        value: 'date',
        text: 'Дата'
      }
    ],
  }),
  async mounted() {
    this.$loader.enable();
    const { data: { data } } = await this.$axios.get(`/v1/economy/my/solarium`);
    this.reports = data;
    this.$loader.disable();
  },
  computed: {
    filteredReports () {
      return this.reports;
    },
    totalSolarium () {
      return this.filteredReports.reduce((a, c) => {
        return a + c.minutes
      }, 0);
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
