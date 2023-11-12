<template>
  <div>
    <t-card-page title="Заканчивающиеся безлимиты">
      <div class="flex justify-center items-center p-8" v-if="loading">
        <loading-spinner />
      </div>
      <div v-else>
        <v-text-field
          v-model="searchItems"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        />
        <v-data-table
          :items="items"
          :search="searchItems"
          :headers="itemsHeaders"
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
      </div>
    </t-card-page>
  </div>
</template>

<script>
import {openInWhatsapp} from '@/utils/clients/clientsFunctions';

export default {
  data: () => ({
    disableRowClick: false,
    loading: true,
    items: [],
    searchItems: '',
    itemsHeaders: [
      {
        value: 'service.name',
        text: 'Услуга'
      },
      {
        value: 'client.name',
        text: 'Клиент'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'active_until',
        text: 'Дата окончания'
      },
      {
        value: 'actions',
        text: 'Действие'
      }
    ],
  }),
  async mounted () {
    this.$loader.enable();
    const response = await this.$axios.$get('/v1/stats/unlimited-ending');
    this.items = response.items;
    this.loading = false;
    this.$loader.disable();
  },
  computed: {},
  methods: {
    _openWhatsapp (item) {
      return openInWhatsapp(item.unmasked_phone);
    },
    openInNewTab (item) {
      this.disableRowClick = true;
      const link = document.createElement('a');
      link.href = `/clients/${item.client_id}`;
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
      if (this.items.length === 1) {
        this.searchInput = '';
      }
      this.$router.push(`/clients/${e.client_id}`)
    },
  },
}
</script>

<style scoped lang="scss">

</style>
