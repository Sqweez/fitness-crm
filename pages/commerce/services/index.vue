<template>
  <div>
    <t-card-page title="Прайс-лист">
      <v-btn
        @click="$router.push('/commerce/services/create')"
        color="primary"
        dark
      >
        Добавить
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
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
              :items="types"
              v-model="typeId"
              item-value="id"
              item-text="name"
              label="Тип"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-text-field
        ref="searchInput"
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
      <confirmation-modal :state="showDeleteModal" @close="showDeleteModal = false" />
      <v-data-table
        :items-per-page="-1"
        :headers="headers"
        :items="filteredServices"
        :search="search"
      >
        <template v-slot:top="{ pagination, options, updateOptions }">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
        </template>
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
        <template v-slot:item.price="{item}">
          {{ item.price | priceFilters }}
        </template>
        <template v-slot:item.prolongation_price="{item}">
          {{ item.prolongation_price | priceFilters }}
        </template>
        <template v-slot:item.extra="{item}">
          <v-list>
            <t-list-item title="Количество посещений" v-if="item.type.id === 3">
              {{ item.entries_count }}
            </t-list-item>
            <t-list-item title="Срок действия (дней)">
              {{ item.validity_days }}
            </t-list-item>
            <t-list-item title="Срок действия (минут)" v-if="item.type.id === 2">
              {{ item.validity_minutes }}
            </t-list-item>
            <t-list-item title="Стоимость для безлимитчиков" v-if="item.unlimited_price !== 0 && item.unlimited_price !== item.price">
              {{ item.unlimited_price | priceFilters }}
            </t-list-item>
            <t-list-item title="Стоимость пролонгации" v-if="item.prolongation_price !== 0 && item.prolongation_price !== item.price">
              {{ item.prolongation_price | priceFilters }}
            </t-list-item>
            <t-list-item title="Стоимость восстановления" v-if="item.restore_price !== 0">
              {{ item.restore_price | priceFilters }}
            </t-list-item>
          </v-list>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="_onDeleteClick(item.id)" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon @click="$router.push(`/commerce/services/${item.id}/edit`)" color="success">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import isBossMiddleware from '@/middleware/isBossMiddleware';

export default {
  name: 'ServiceIndexPage',
  middleware: [isBossMiddleware],
  data: () => ({
    showDeleteModal: false,
    search: '',
    clubId: -1,
    typeId: -1,
    headers: [
      {
        value: 'ordinal',
        text: '#'
      },
      {
        value: 'id',
        text: 'id',
        align: ' hidden'
      },
      {
        value: 'name',
        text: 'Название'
      },
      {
        value: 'type.name',
        text: 'Тип'
      },
      {
        value: 'price',
        text: 'Стоимость'
      },
      /*{
        value: 'unlimited_price',
        text: 'Стоимость для безлимитчиков'
      },
      {
        value: 'prolongation_price',
        text: 'Стоимость пролонгации'
      },*/
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'extra',
        text: 'Доп информация'
      },
      {
        value: 'actions',
        text: 'Действие'
      }
    ],
  }),
  computed: {
    ...mapGetters({
      'services': 'services/SERVICES',
      'clubs': 'common/CLUBS_FILTERS',
      'types': 'common/SERVICE_TYPES_FILTER',
    }),
    filteredServices () {
      return this.services.filter(s => {
        return this.clubId === -1 ? true : s.club.id === this.clubId;
      }).filter(s => {
        return this.typeId === -1 ? true : s.type.id === this.typeId;
      })
    }
  },
  async mounted() {
    this.$loader.enable('Пожалуйста, подождите...');
    await this.$getServices();
    this.$refs.searchInput.focus();

    this.$loader.disable();
  },
  methods: {
    ...mapActions({
      '$getServices': 'services/getServices',
      '$deleteService': 'services/deleteService'
    }),
    _onDeleteClick (id) {
      this.$confirm('Вы действительно хотите удалить выбранную услугу?')
        .then(_ => {
          this.$loader.enable('Пожалуйста, подождите');
          this.$deleteService(id);
          this.$loader.disable();
        })
    },
  }
}
</script>

<style scoped lang="scss">

</style>
