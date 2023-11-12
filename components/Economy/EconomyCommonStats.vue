<template>
  <div>
    <t-card-page title="Общая статистика">
      <v-menu
        ref="dateMenu"
        v-model="dateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="dates"
        transition="scale-transition"
        min-width="auto"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dates.map(d => d.split('-').reverse().join('.')).join('~')"
            label="Произвольный период"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker
          :first-day-of-week="1"
          v-model="dates"
          no-title
          scrollable
          range
        >
          <div class="flex-grow-1"></div>
          <v-btn
            text
            outlined
            color="primary"
            @click="dateMenu = false"
          >
            Отмена
          </v-btn>
          <v-btn
            text
            outlined
            color="primary"
            @click="changeCustomDate(dateMenu, dates) "
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-btn color="success" @click="loadReport" :disabled="dates.length === 0">
        Получить статистику
      </v-btn>
      <div v-if="isLoaded" class="mt-4">
        <t-line-chart :chart-data="dataCollection"/>
      </div>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  data: () => ({
    dateMenu: null,
    dates: [],
    isLoaded: false,
  }),
  computed: {
    ...mapGetters({
      $reports: 'economy/GRAPH_REPORTS'
    }),
    dataCollection () {
      return {
        labels: this.$reports.dates,
        datasets: this.$reports.reports.map(r => ({
          ...r,
          backgroundColor: r.color,
          hoverBackgroundColor: r.color,
         // borderColor: '#000'
        }))
      };
    }
  },
  methods: {
    ...mapActions({
      $getReports: 'economy/getGraphReports'
    }),
    changeCustomDate () {
      this.$refs.dateMenu.save(this.dates);
    },
    async loadReport () {
      const dateObject = {
        start: this.dates[0],
        finish: this.dates[1],
      };
      try {
        this.$loader.enable();
        await this.$getReports(dateObject);
        this.isLoaded = true;
      } catch (e) {}
      finally {
        this.$loader.disable();
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
