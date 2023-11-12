<template>
  <div>
    <t-card-page title="Гости клуба за сегодня">
      <div class="flex justify-center items-center p-8" v-if="loading">
        <loading-spinner />
      </div>
      <div v-if="!loading">
        <v-list flat>
          <t-list-item title="Всего гостей">
            {{ filteredClients.length }}
          </t-list-item>
        </v-list>
        <v-select
          v-if="IS_BOSS"
          label="Клуб"
          :items="clubs"
          item-text="name"
          item-value="id"
          v-model="clubId"
        />
      </div>
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
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import userMixin from '@/mixins/userMixin';
import {openInWhatsapp} from '@/utils/clients/clientsFunctions';

export default {
  mixins: [userMixin],
  data: () => ({
    loading: true,
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
        value: 'actions',
        text: 'Действие'
      }
    ],
    disableRowClick: false,
    clubId: -1,
  }),
  computed: {
    filteredClients () {
      return this.$store.getters['dashboard/todayGuests'].filter(c => {
        return this.clubId === - 1 ? true : c.club.id === this.clubId;
      });
    },
    clubs () {
      return this.$store.getters['common/CLUBS_FILTERS'];
    }
  },
  async mounted() {
    this.loading = true;
    await this.getClients();
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getClients: 'dashboard/getTodayGuests'
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
      this.$router.push(`/clients/${e.id}`)
    },
  }
}
</script>

<style scoped lang="scss">

</style>
