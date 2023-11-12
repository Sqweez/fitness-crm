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
      <template v-slot:item.minutes="{ item }">
        {{ item.minutes }} мин
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
        text: 'Услуга',
        value: 'service.name',
      },
      /*  {
          text: 'Программа',
          value: 'service'
        },*/
      {
        text: 'Клуб',
        value: 'club.name'
      },
      {
        text: 'Сотрудник',
        value: 'user.name'
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
