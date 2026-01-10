<template>
  <t-card-page title="" flat>
    <v-alert color="orange darken-2" dark>
      Активные клиенты
    </v-alert>
    <v-responsive height="300" v-if="loading" class="flex justify-center items-center w-full text-center">
      <v-progress-circular
        size="48"
        indeterminate
        color="purple darken-2"
      />
    </v-responsive>
    <div v-else>
      <h3 class="text-xl font-medium mb-2">
        Всего клиентов: {{ filteredClients.length }}
      </h3>
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
            />
            <v-select
              :items="genders"
              v-model="genderId"
              item-value="id"
              item-text="value"
              label="Пол"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-select
        class="w-full"
        :items="clubs"
        v-model="clubId"
        item-value="id"
        item-text="name"
        label="Клуб"
        v-if="isBoss"
      />
      <v-text-field
        v-model="searchInput"
        label="Поиск"
        single-line
        hide-details
      >
        <template v-slot:append>
          <Search :size="20" class="text-gray-400" />
        </template>
      </v-text-field>
    </div>
    <v-data-table
      v-if="!loading"
      light
      :items-per-page="10"
      :items="filteredClients"
      :headers="headers"
      no-data-text="Нет доступных клиентов"
      @click:row="_onRowClick"
    >
      <template v-slot:item.actions="{item}">
        <v-btn small icon @click.stop="openInNewTab(item)">
          <ExternalLink :size="18" />
        </v-btn>
      </template>
    </v-data-table>
  </t-card-page>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import GENDERS from '@/utils/enums/GENDERS';
import { ExternalLink, Search } from 'lucide-vue';

export default {
  components: { ExternalLink, Search },
  data: () => ({
    loading: true,
    clubId: -1,
    genderId: -1,
    searchInput: '',
    disableRowClick: false,
    genders: [
      {
        id: -1,
        value: 'Все'
      },
      ...GENDERS
    ]
  }),
  props: {
    isBoss: {
      type: Boolean,
      default: false,
    }
  },
  async mounted() {
    this.loading = true;
    await this.getClients();
    this.loading = false;
  },
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS_FILTERS',
    }),
    filteredClients () {
      return this.clients.filter(client => {
        return this.clubId === -1 ? true : client.club.id === this.clubId;
      }).filter(client => {
        return this.genderId === - 1 ? true : client.gender === this.genderId;
      });
    },
    headers () {
      return [
        {
          value: 'name',
          text: 'ФИО'
        },
        {
          value: 'phone',
          text: 'Телефон'
        },
        {
          value: 'club.name',
          text: 'Клуб'
        },
        {
          value: 'gender_display',
          text: 'Пол'
        },
        {
          value: 'actions',
          text: 'Действие'
        }
      ];
    }
  },
  methods: {
    openInNewTab (item) {
      this.disableRowClick = true;
      const link = document.createElement('a');
      link.href = `/clients/${item.id}`;
      link.target = '_blank';
      link.click();
      setTimeout(() => {
        this.disableRowClick = false;
      }, 500);
    },
    async getClients () {
      const response = await this.$axios.$get('/v1/stats/active-clients');
      this.clients = response.clients;
    },
    _onRowClick (e, z, v) {
      if (this.disableRowClick) {
        return ;
      }
      if (this.clients.length === 1) {
        this.searchInput = '';
      }
      this.$router.push(`/clients/${e.id}`)
    },
  }
}
</script>

<style scoped lang="scss">

</style>
