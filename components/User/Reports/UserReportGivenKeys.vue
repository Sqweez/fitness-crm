<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header color="green darken-1">
          <h5 class="text-white"><b>
            История выдачи ключей
          </b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            color="indigo darken-2"
            label="Поиск"
            type="search"
            v-model="search"
          />
          <div class="flex gap-x-2">
            <v-list>
              <t-list-item title="Всего выдано ключей">
                {{ items.length  }}
              </t-list-item>
            </v-list>
          </div>
          <v-data-table
            :search="search"
            :items="items"
            :headers="headers"
            :items-per-page="-1"
            no-data-text="Нет данных по выбранному периоду"
          >
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
        text: 'Клиент',
        value: 'client.name'
      },
      {
        text: 'Номер шкафчика',
        value: 'trinket.cabinet_number'
      },
      {
        text: 'Клуб',
        value: 'club.name'
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
