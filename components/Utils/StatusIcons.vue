<template>
  <div>
    <v-icon v-if="state" color="success">
      mdi-check
    </v-icon>
    <v-icon v-else color="error">
      mdi-close
    </v-icon>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">

</style>
