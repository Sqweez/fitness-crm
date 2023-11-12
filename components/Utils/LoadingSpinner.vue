<template>
  <div>
    <v-progress-circular
      size="48"
      indeterminate
      :color="color"
    />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'indigo darken-2'
    }
  },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
