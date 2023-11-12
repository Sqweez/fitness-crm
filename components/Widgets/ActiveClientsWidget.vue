<template>
  <t-card-page title="Кто в клубе" color="#26c6da" dark>
    <v-responsive height="300" v-if="loading" class="flex justify-center items-center w-full text-center">
      <v-progress-circular
        size="48"
        indeterminate
        color="white"
      />
    </v-responsive>
    <div v-else>
      <v-expansion-panels light v-if="isBoss">
        <v-expansion-panel>
          <v-expansion-panel-header color="#26c6da">
            <h5 class="text-white"><b>Фильтры:</b></h5>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-select
              light
              :items="clubs"
              v-model="clubId"
              item-value="id"
              item-text="name"
              label="Клуб"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <h3 class="text-xl text-white font-medium mb-2">
      Всего клиентов: {{ filteredClients.length }}
    </h3>
    <v-data-table
      v-if="!loading"
      :items-per-page="-1"
      light
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
      clients: 'dashboard/inGymClients',
      clubs: 'common/CLUBS_FILTERS'
    }),
    filteredClients () {
      return this.clients.filter(client => {
        return this.clubId === -1 ? true : client.club.id === this.clubId;
      });
    },
    headers () {
      let headers = [
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

      if (!this.isBoss) {
        headers.splice(2, 1);
      }

      return headers;
    }
  },
  methods: {
    ...mapActions({
      getClients: 'dashboard/getInGymClients'
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
