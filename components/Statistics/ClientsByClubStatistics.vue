<template>
  <div>
    <t-card-page title="" flat>
      <v-alert color="blue darken-2" dark>
        Количество клиентов, по клубам
      </v-alert>
      <div v-if="!isLoaded" class="flex justify-center items-center">
        <lazy-loading-spinner />
      </div>
      <div v-else>
        <v-simple-table v-slot:default>
          <thead>
          <tr>
            <th>Клуб</th>
            <th class="text-center">Мужчины</th>
            <th class="text-center">Женщины</th>
            <th class="text-center">Активные</th>
            <th class="text-center">Всего</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item of items" :key="item.id">
            <td class="font-semibold">
              {{ item.name }}
            </td>
            <td class="text-center">
              {{ item.total_man_clients }} ({{ item.total_man_percentage }}%)
            </td>
            <td class="text-center">
              {{ item.total_woman_clients }} ({{ item.total_woman_percentage }}%)
            </td>
            <td class="text-center">
              {{ item.total_active_clients }} ({{ item.total_active_percentage }}%)
            </td>
            <td class="text-center">
              {{ item.total_clients }}
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </div>
    </t-card-page>
  </div>
</template>

<script>
export default {
  data: () => ({
    isLoaded: false,
    items: [],
  }),
  async mounted () {
    const response =  await this.$axios.$get('/v1/stats/clients-by-club');
    this.items = response.report;
    this.isLoaded = true;
  },
  computed: {},
  methods: {},
}
</script>

<style scoped lang="scss">

</style>
