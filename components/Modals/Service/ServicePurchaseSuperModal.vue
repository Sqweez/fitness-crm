<template>
  <base-modal
    :title="`Продажа услуги ${payload.name}`"
    :state="state"
    :max-width="800"
    @close="$emit('close')"
  >
    <template #default>
      <div v-if="state">
        <v-text-field
          label="Наименование"
          v-model="payload.self_name"
        />
        <v-text-field
          label="Стоимость"
          v-model="payload.amount"
        />
      </div>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn color="success" text @click="$emit('submit', payload)">
        Продать <v-icon>mdi-check</v-icon>
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
export default {
  data: () => ({}),
  computed: {},
  methods: {},
  props: {
    state: {
      type: Boolean
    },
    payload: {
      type: Object
    }
  }
}
</script>

<style scoped lang="scss">

</style>
