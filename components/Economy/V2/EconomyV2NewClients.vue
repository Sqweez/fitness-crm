<template>
  <economy-v2-report-table
    endpoint="new-clients"
    :headers="headers"
    :params="params"
    @click:row="(row) => $router.push(`/clients/${row.id}`)"
  >
    <template v-slot:item.balance="{ item }">
      {{ item.balance | priceFilters }}
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
      { value: 'name', text: 'Клиент' },
      { value: 'club.name', text: 'Клуб' },
      { value: 'balance', text: 'Баланс' },
      { value: 'registrar.name', text: 'Кто создал' },
      { value: 'date', text: 'Дата создания' },
    ],
  }),
}
</script>
