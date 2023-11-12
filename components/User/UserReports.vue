<template>
  <div>
    <t-card-page title="Отчеты по работе">
      <t-date-picker
        simple
        v-model="dates"
      />
      <v-btn
        dark
        color="indigo"
        class="mb-2"
        @click="onSubmit"
      >
        Получить отчет
      </v-btn>
      <div v-if="isLoading" class="w-full flex justify-center items-center py-6">
        <lazy-loading-spinner />
      </div>
      <div v-if="!isLoading && isDataLoaded">
        <lazy-user-report-replenishments
          :items="reports.replenishments"
        />
        <div class="my-3"/>
        <lazy-user-report-withdrawals
          :items="reports.withdrawals"
        />
        <div class="my-3"/>
        <lazy-user-report-service-sales
          :items="reports.service_sales"
        />
        <div class="my-3" />
        <lazy-user-report-shop-sales
          :items="reports.shop_sales"
        />
        <div class="my-3" />
        <lazy-user-report-given-keys
          :items="reports.given_keys"
        />
        <div class="my-3" />
        <lazy-user-report-write-off-solarium
          :items="reports.solarium_visits"
        />
      </div>
    </t-card-page>
  </div>
</template>

<script>
export default {
  data: () => ({
    dates: [],
    reports: [],
    isLoading: false,
    isDataLoaded: false,
  }),
  computed: {
    isSubmitEnabled () {
      return this.dates.length === 2 && this.dates.every(c => !!c);
    },
    user () {
      return this.$store.getters['users/USER'];
    }
  },
  methods: {
    async onSubmit () {
      if (!this.isSubmitEnabled) {
        return this.$toast.error('Выберите обе даты');
      }
      this.isDataLoaded = false;
      this.isLoading = true;
      const payload = new URLSearchParams({
        start: this.dates[0],
        finish: this.dates[1],
      });
      this.reports = await this.$axios.$get(`v1/users/${this.user.id}/reports?${payload}`);
      this.isLoading = false;
      this.isDataLoaded = true;
    },
  }
}
</script>

<style scoped lang="scss">

</style>
