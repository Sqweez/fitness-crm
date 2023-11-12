<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header color="yellow darken-1">
          <h5 class="text-white"><b>
            История списания солярий
          </b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            color="indigo darken-2"
            label="Поиск"
            type="search"
            v-model="search"
          />
          <div class="flex gap-x-2">
            <v-list>
              <t-list-item title="Количество, минут">
                {{ total }} мин
              </t-list-item>
            </v-list>
            <v-list>
              <t-list-item title="Количество списаний">
                {{ totalVisits }}
              </t-list-item>
            </v-list>
          </div>
          <v-data-table
            :search="search"
            :items="items"
            :headers="headers"
            :items-per-page="-1"
            no-data-text="Нет данных по выбранному периоду"
          >
            <template v-slot:item.amount="{ item }">
              {{ item.amount | priceFilters }}
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';

export default {
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Дата',
        value: 'date'
      },
      {
        text: 'Количество, мин',
        value: 'minutes'
      },
      {
        text: 'Клиент',
        value: 'client.name'
      },
      {
        text: 'Клуб',
        value: 'club.name'
      },
    ],
  }),
  computed: {
    total () {
      return this.items.reduce((a, c) => {
        return a + c.minutes;
      }, 0);
    },
    totalVisits () {
      return this.items.length;
    },
  },
  methods: {},
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss">

</style>
