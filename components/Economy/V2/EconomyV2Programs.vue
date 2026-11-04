<template>
  <economy-v2-report-table
    endpoint="programs"
    :headers="headers"
    :params="params"
  >
    <template v-slot:totals="{ totals }">
      <t-list-item title="Общая сумма покупок">
        {{ totals.amount | priceFilters }}
      </t-list-item>
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
      { value: 'name', text: 'Услуга' },
      { value: 'amount', text: 'Сумма' },
      { value: 'user.name', text: 'Сотрудник' },
      { value: 'club.name', text: 'Клуб' },
      { value: 'date', text: 'Дата' },
    ],
  }),
}
</script>
