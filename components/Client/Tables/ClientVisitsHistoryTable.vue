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
    ></v-data-table>
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
        value: 'service'
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
        text: 'Тренер',
        value: 'trainer.name'
      },
      {
        text: 'Шкафчик',
        value: 'trinket'
      }
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
