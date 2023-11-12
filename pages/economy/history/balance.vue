<template>
  <div>
    <t-card-page title="История моих фин операций за день">
      <v-row>
        <v-col>
          <h3
            class="ml-4 text-xl font-medium"
          >
            Пополнения:
          </h3>
          <v-list>
            <t-list-item title="Общая сумма наличными">
              {{ totalCashAmount | priceFilters }}
            </t-list-item>
            <t-list-item title="Общая сумма картой">
              {{ totalCardCashAmount | priceFilters }}
            </t-list-item>
            <t-list-item title="Итого">
              {{ totalAmount | priceFilters }}
            </t-list-item>
          </v-list>
        </v-col>
        <v-col>
          <h3
            class="ml-4 text-xl font-medium"
          >
            Списания:
          </h3>
          <v-list>
            <t-list-item title="Общая сумма наличными">
              {{ totalWithDrawalCashAmount | priceFilters }}
            </t-list-item>
            <t-list-item title="Общая сумма картой">
              {{ totalWithDrawalCardCashAmount | priceFilters }}
            </t-list-item>
            <t-list-item title="Итого">
              {{ totalWithDrawalAmount | priceFilters }}
            </t-list-item>
          </v-list>
        </v-col>
        <v-col>
          <h3
            class="ml-4 text-xl font-medium"
          >
            Остаток:
          </h3>
          <v-list>
            <t-list-item title="Общая сумма наличными">
              {{ (totalCashAmount - totalWithDrawalCashAmount) | priceFilters }}
            </t-list-item>
            <t-list-item title="Общая сумма картой">
              {{ (totalCardCashAmount - totalWithDrawalCardCashAmount) | priceFilters }}
            </t-list-item>
            <t-list-item title="Итого">
              {{ (totalAmount - totalWithDrawalAmount) | priceFilters }}
            </t-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="filteredReports"
        :search="search"
        :items-per-page="-1"
      >
        <template v-slot:item.amount="{item}">
          {{ item.amount | priceFilters }}
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';

export default {
  data: () => ({
    search: '',
    reports: [],
    headers: [
      {
        value: 'client.name',
        text: 'Кому'
      },
      {
        value: 'amount',
        text: 'Сумма'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'description',
        text: 'Комментарий'
      },
      {
        value: 'payment_type_text',
        text: 'Способ оплаты'
      },
      {
        value: 'date',
        text: 'Дата'
      }
    ],
  }),
  async mounted() {
    this.$loader.enable();
    const { data } = await this.$axios.get(`/v1/economy/my/top-ups`);
    console.log(data);
    this.reports = data;
    this.$loader.disable();
  },
  computed: {
    filteredReports () {
      return this.reports;
    },
    totalAmount () {
      return this.filteredReports
        .filter(r => r.type === __hardcoded('top-up'))
        .reduce((a, c) => a + c.amount, 0);
    },
    totalCashAmount () {
      return this.reports
        .filter(r => r.payment_type === __hardcoded(1))
        .filter(r => r.type === __hardcoded('top-up'))
        .reduce((a, c) => a + c.amount, 0);
    },
    totalCardCashAmount () {
      return this.reports
        .filter(r => r.payment_type === __hardcoded(2))
        .filter(r => r.type === __hardcoded('top-up'))
        .reduce((a, c) => a + c.amount, 0);
    },
    totalWithDrawalAmount () {
      return this.filteredReports
        .filter(r => r.type === __hardcoded('withdrawal'))
        .reduce((a, c) => a + c.amount, 0);
    },
    totalWithDrawalCashAmount () {
      return this.reports
        .filter(r => r.payment_type === __hardcoded(1))
        .filter(r => r.type === __hardcoded('withdrawal'))
        .reduce((a, c) => a + c.amount, 0);
    },
    totalWithDrawalCardCashAmount () {
      return this.reports
        .filter(r => r.payment_type === __hardcoded(2))
        .filter(r => r.type === __hardcoded('withdrawal'))
        .reduce((a, c) => a + c.amount, 0);
    },
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
