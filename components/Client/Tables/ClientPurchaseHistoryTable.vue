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
      :items-per-page="-1"
      :headers="headers"
      no-data-text="Нет данных по выбранному периоду"
    >
      <template v-slot:item.margin="{ item }">
        {{ item.margin | priceFilters }}
      </template>
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
  }),
  computed: {
    headers () {
      const headers = [
        {
          value: 'date',
          text: 'Дата'
        },
        {
          value: 'product_name',
          text: 'Товар'
        },
        {
          value: 'amount',
          text: 'Стоимость'
        },
        {
          value: 'user.name',
          text: 'Сотрудник'
        },
        {
          value: 'margin',
          text: 'Доход'
        },
      ];

      if (!this.$auth.user.is_boss) {
        headers.splice(4, 1);
      }

      return headers;
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
