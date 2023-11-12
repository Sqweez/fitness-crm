<template>
  <div>
    <birthday-clients-widget :is-boss="IS_BOSS" />
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
