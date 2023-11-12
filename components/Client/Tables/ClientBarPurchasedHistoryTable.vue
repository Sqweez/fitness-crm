<template>
  <div>
    <v-text-field
      color="indigo darken-2"
      label="Поиск"
      type="search"
      v-model="search"
    />
    <v-data-table
      :search="search"
      :items-per-page="-1"
      :items="items"
      :headers="headers"
      no-data-text="Нет данных по выбранному периоду"
    >
      <template v-slot:item.amount="{ item }">
        {{ item.amount | priceFilters }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Дата',
        value: 'date',
      },
      {
        text: 'Сумма',
        value: 'amount'
      },
      {
        text: 'Сотрудник',
        value: 'user.name'
      },
      {
        text: 'Способ оплаты',
        value: 'payment_type'
      },
      {
        text: 'Комментарий',
        value: 'description'
      },
    ],
  }),
  computed: {},
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
