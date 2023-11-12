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
      :items="items"
      :headers="headers"
      :items-per-page="-1"
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
        value: 'date'
      },
      {
        text: 'Программа',
        value: 'service.name'
      },
      {
        text: 'Клуб',
        value: 'club.name'
      },
      {
        text: 'Сотрудник',
        value: 'user.name'
      },
      {
        text: 'Стоимость',
        value: 'amount'
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
