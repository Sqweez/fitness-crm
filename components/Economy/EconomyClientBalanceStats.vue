<template>
  <div>
    <t-card-page title="Денег у клиентов на картах">
      <v-list>
        <t-list-item v-for="report of reports" :key="report.id" :title="report.name">
          {{ report.amount | priceFilters }}
        </t-list-item>
        <t-list-item title="Всего">
          {{ totalAmount | priceFilters }}
        </t-list-item>
      </v-list>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      'reports': 'economy/CLIENTS_BALANCE',
    }),
    totalAmount () {
      return this.reports.reduce((a, c) => {
        return a + c.amount;
      }, 0);
    }
  },
  async mounted () {
    this.$loader.enable();
    await this.$getReports();
    this.$loader.disable();
  },
  methods: {
    ...mapActions({
      '$getReports': 'economy/getClientsBalance',
    })
  }
}
</script>

<style scoped lang="scss">

</style>
