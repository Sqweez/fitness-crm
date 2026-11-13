<template>
  <div>
    <t-card-page title="Клиенты">
      <v-btn
        v-if="canCreateClients"
        @click="$router.push('/clients/create')"
        color="primary"
        dark
      >
        Добавить клиента
        <Plus :size="18" class="ml-1" />
      </v-btn>
      <v-expansion-panels class="mt-4 mb-2" v-if="false">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3 class="text-white"><b>Фильтры</b></h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              :items="clubs"
              v-model="clubId"
              item-value="id"
              item-text="name"
              label="Клуб"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-text-field
        ref="searchTextInput"
        v-model="searchInput"
        label="Начните что-нибудь искать 🤖"
        single-line
        hide-details
      >
        <template v-slot:append>
          <Search :size="20" class="text-gray-400" />
        </template>
      </v-text-field>
      <v-data-table
        :items-per-page="-1"
        :loading="isSearching"
        :no-data-text="!search.length ? 'Начните что-нибудь искать 🤖' : 'Нет результатов 🥲'"
        :headers="headers"
        :items="clients"
        @click:row="_onRowClick"
        @current-items="getFilteredClients"
      >
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
        <template v-slot:item.balance="{item}">
          {{ item.balance | priceFilters }}
        </template>
        <template v-slot:item.is_in_club="{item}">
          <status-icons :state="item.is_in_club" />
        </template>
        <template v-slot:item.actions="{item}">
          <v-btn small icon @click.stop="openInNewTab(item)">
            <ExternalLink :size="18" />
          </v-btn>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import { __debounce } from '@/utils/helpers';
import { ExternalLink, Plus, Search } from 'lucide-vue';

export default {
  name: 'ClientsPage',
  components: { ExternalLink, Plus, Search },
  data: () => ({
    searchInput: '',
    search: '',
    clubId: -1,
    headers: [
      {
        value: 'ordinal',
        text: '#'
      },
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
        value: 'balance',
        text: 'Баланс'
      },
      {
        value: 'pass',
        text: 'pass',
        align: ' hidden',
      },
      {
        value: 'is_in_club',
        text: 'В клубе?',
      },
      {
        value: 'trinket',
        text: 'trinket',
        align: ' hidden',
      },
      {
        value: 'actions',
        text: 'Действие'
      }
    ],
    isSearching: false,
    disableRowClick: false,
  }),
  mounted() {
   this.focusInput();
  },
  computed: {
    ...mapGetters({
      '_clients': 'clients/SEARCHED_CLIENTS',
      'clubs': 'common/CLUBS_FILTERS'
    }),
    canShowResults () {
      return this.search.length > 0 && !this.isSearching;
    },
    clients () {
      return this.canShowResults ? this._clients.filter(c => {
        return this.clubId === -1 ? true : c.club.id === this.clubId;
      }) : [];
    },
    canCreateClients () {
      return this.$auth.loggedIn && this.$auth.user.permissions.can_create_clients;
    },
  },
  methods: {
    ...mapActions({
      '$getClients': 'clients/getClients',
      '$searchClients': 'clients/searchClients'
    }),
    focusInput () {
      const searchInput = this.$refs.searchTextInput;
      if (searchInput) {
        searchInput.focus();
      }
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
    getFilteredClients(clients) {
      if (clients.length === 1) {
        this._onRowClick(clients[0]);
      }
    },
    openInNewTab (item) {
      this.disableRowClick = true;
      const link = document.createElement('a');
      link.href = `/clients/${item.id}`;
      link.target = '_blank';
      link.click();
      setTimeout(() => {
        this.disableRowClick = false;
      }, 500);
    }
  },
  watch: {
    searchInput: __debounce(function (newValue) {
      this.search = newValue;
    }),
    async search (value) {
      if (!value || value.length < 3 || this.isSearching) {
        return null;
      }
      this.isSearching = true;
      await this.$searchClients(value);
      if (this._clients.length === 0) {
        this.searchInput = '';
        this.focusInput();
      }
      this.isSearching = false;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
