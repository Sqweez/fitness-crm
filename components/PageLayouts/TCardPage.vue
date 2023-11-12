<template>
  <v-card v-bind="$attrs">
    <v-card-title v-if="!noTitle">
      {{ title }}
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Страница'
    },
    noTitle: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
