<template>
  <v-list-item color="success">
    <v-list-item-content>
      <v-list-item-title>
        <slot></slot>
      </v-list-item-title>
      <v-list-item-subtitle :class="[{'text-red-500': error}]">
        {{ title }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="hasSlotAction">
      <slot name="action"></slot>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    hasSlotAction () {
      return !!this.$slots.action;
    }
  },
  methods: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped lang="scss">

</style>
