<template>
  <economy-v2-report-table
    endpoint="top-ups"
    :headers="headers"
    :params="params"
  >
    <template v-slot:totals="{ totals }">
      <v-list>
        <div class="flex gap-x-2">
          <v-list>
            <t-list-item title="Общая сумма пополнений">
              {{ totals.amount | priceFilters }}
            </t-list-item>
          </v-list>
          <v-list>
            <t-list-item title="Общая сумма наличные">
              {{ totals.cash | priceFilters }}
            </t-list-item>
          </v-list>
          <v-list>
            <t-list-item title="Общая сумма безналичные">
              {{ totals.cashless | priceFilters }}
            </t-list-item>
          </v-list>
        </div>
      </v-list>
    </template>
    <template v-slot:item.amount="{ item }">
      {{ item.amount | priceFilters }}
    </template>
  </economy-v2-report-table>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { value: 'client.name', text: 'Клиент' },
      { value: 'amount', text: 'Сумма' },
      { value: 'user.name', text: 'Сотрудник' },
      { value: 'club.name', text: 'Клуб' },
      { value: 'date', text: 'Дата' },
    ],
  }),
}
</script>
