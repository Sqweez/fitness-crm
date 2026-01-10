<template>
  <div>
    <v-list>
      <t-list-item title="Количество посещений">
        {{ totalVisits }}
      </t-list-item>
      <t-list-item title="Количество уникальных посетителей">
        {{ totalUniqueVisitors }}
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
      @click:row="(e) => {$router.push(`/clients/${e.client.id}`)}"
    >
      <template v-slot:item.money_spent="{item}">
        {{ item.money_spent | priceFilters }}
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
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'money_spent',
        text: 'Денег потрачено'
      },
      {
        value: 'created_at',
        text: 'Дата прихода'
      },
      {
        value: 'finished_at',
        text: 'Дата ухода'
      },
      {
        value: 'start_user.name',
        text: 'Встретил'
      },
      {
        value: 'finish_user.name',
        text: 'Проводил'
      },
      {
        value: 'time_duration',
        text: 'Времени в клубе'
      }
    ],
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
      reports: 'economy/CLUB_GUESTS',
      clubs: 'common/CLUBS_FILTERS'
    }),
    filteredReports () {
      return this.reports.filter(r => {
        return this.club === -1  ? true : r.club.id === this.club;
      }).filter(r => {
        return this.user === -1 ? true : (r.start_user.id === this.user);
      });
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
