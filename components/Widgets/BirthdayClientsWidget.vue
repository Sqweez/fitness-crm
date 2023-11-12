<template>
  <t-card-page title="" flat>
    <v-alert color="red darken-2" dark>
      Именинники
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
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </div>
    <v-data-table
      v-if="!loading"
      light
      :items-per-page="-1"
      :items="filteredClients"
      :headers="headers"
      no-data-text="Нет доступных клиентов"
      @click:row="_onRowClick"
    >
      <template v-slot:item.actions="{item}">
        <v-btn small icon @click.stop="_openWhatsapp(item)">
          <v-icon>mdi-whatsapp</v-icon>
        </v-btn>
        <v-btn small icon @click.stop="openInNewTab(item)">
          <v-icon>mdi-tab</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </t-card-page>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {openInWhatsapp} from '@/utils/clients/clientsFunctions';

export default {
  data: () => ({
    loading: true,
    clubId: -1,
    searchInput: '',
    disableRowClick: false,
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
      clients: 'dashboard/birthdayClients',
      clubs: 'common/CLUBS_FILTERS'
    }),
    filteredClients () {
      return this.clients.filter(client => {
        return this.clubId === -1 ? true : client.club.id === this.clubId;
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
          value: 'actions',
          text: 'Действие'
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      getClients: 'dashboard/getBirthdayClients'
    }),
    _openWhatsapp (item) {
      return openInWhatsapp(item.unmasked_phone);
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
