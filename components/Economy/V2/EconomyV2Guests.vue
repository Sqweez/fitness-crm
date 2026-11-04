<template>
  <economy-v2-report-table
    endpoint="guests"
    :headers="headers"
    :params="params"
    @click:row="(row) => $router.push(`/clients/${row.client.id}`)"
  >
    <template v-slot:totals="{ totals }">
      <v-list>
        <t-list-item title="Количество посещений">
          {{ totals.visits }}
        </t-list-item>
        <t-list-item title="Количество уникальных посетителей">
          {{ totals.unique_visitors }}
        </t-list-item>
      </v-list>
    </template>
    <template v-slot:item.money_spent="{ item }">
      {{ item.money_spent | priceFilters }}
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
      { value: 'club.name', text: 'Клуб' },
      { value: 'money_spent', text: 'Денег потрачено' },
      { value: 'created_at', text: 'Дата прихода' },
      { value: 'finished_at', text: 'Дата ухода' },
      { value: 'start_user.name', text: 'Встретил' },
      { value: 'finish_user.name', text: 'Проводил' },
      { value: 'time_duration', text: 'Времени в клубе' },
    ],
  }),
}
</script>
