<template>
  <div>
    <sleeping-clients-widget :is-boss="IS_BOSS"/>
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';

export default {
  name: 'SleepingClientsIndexPage',
  mixins: [userMixin],
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
