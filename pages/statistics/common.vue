<template>
  <div>
    <t-card-page title="Общая статистика">
      <lazy-clients-by-club-statistics />
      <lazy-active-clients-stats />
      <lazy-birthday-clients-widget />
      <lazy-wrong-birthday-date-clients />
    </t-card-page>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
