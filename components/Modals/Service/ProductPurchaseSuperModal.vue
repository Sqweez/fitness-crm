<template>
  <base-modal
    :title="`Продажа товара ${payload.full_name}`"
    :state="state"
    :max-width="800"
    @close="$emit('close')"
  >
    <template #default>
      <div v-if="state">
        <v-text-field
          label="Стоимость"
          v-model="payload.price"
        />
      </div>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn color="success" text @click="$emit('submit', payload)">
        Продать <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import { Check } from 'lucide-vue';

export default {
  components: { Check },
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
