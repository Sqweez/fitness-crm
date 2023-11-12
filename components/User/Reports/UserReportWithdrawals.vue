<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header color="indigo darken-2">
          <h5 class="text-white"><b>
            История фин. операций (списания)
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
              <t-list-item title="Общая сумма списаний">
                {{ total | priceFilters }}
              </t-list-item>
            </v-list>
            <v-list>
              <t-list-item title="Общая сумма наличные">
                {{ totalCash | priceFilters }}
              </t-list-item>
            </v-list>
            <v-list>
              <t-list-item title="Общая сумма безналичные">
                {{ totalCashless | priceFilters }}
              </t-list-item>
            </v-list>
            <v-list>
              <t-list-item title="Общая сумма бар">
                {{ totalBar | priceFilters }}
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
              <span class="font-semibold" :class="[item.payment_type ===  2 ? 'text-green-600' : '']">
                {{ item.amount | priceFilters }}
              </span>
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
        text: 'Сумма',
        value: 'amount'
      },
      {
        text: 'Клуб',
        value: 'club.name'
      },
      {
        text: 'Комментарий',
        value: 'description'
      },
    ],
  }),
  computed: {
    total() {
      return this.items.reduce((a, c) => {
        return a + c.amount;
      }, 0);
    },
    totalCash() {
      return this.items
        .filter(i => i.payment_type === __hardcoded(1))
        .filter(i => !i.is_bar)
        .reduce((a, c) => {
          return a + c.amount;
        }, 0)
    },
    totalCashless() {
      return this.items
        .filter(i => i.payment_type === __hardcoded(2))
        .filter(i => !i.is_bar)
        .reduce((a, c) => {
          return a + c.amount;
        }, 0)
    },
    totalBar() {
      return this.items.filter(i => i.is_bar).reduce((a, c) => {
        return a + c.amount;
      }, 0)
    }
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
