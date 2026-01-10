<template>
  <base-modal
    :state="state"
    :max-width="700"
    title="Списание солярия"
    @close="$emit('close')"
  >
    <template #default>
      <v-text-field
        label="Количество минут"
        v-model="minutes"
      />
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text @click="_onSubmit" color="success">
        Списать <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  data: () => ({
    minutes: null,
  }),
  props: {
    state: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    ...mapGetters({
      paymentTypes: 'common/PAYMENT_TYPES',
      client: 'clients/CLIENT'
    }),
  },
  watch: {
    state () {
      this.minutes = null;
    }
  },
  methods: {
    ...mapActions({
      $writeOff: 'clients/writeOffSolarium'
    }),
    async _onSubmit () {
      if (this.minutes > this.client.total_solarium) {
        return this.$toast.error('У клиента недостаточно минут солярия!');
      }
      this.$loader.enable();
      this.$emit('close');
      await this.$writeOff({
        client_id: this.client.id,
        minutes: this.minutes
      })
      this.$loader.disable();
    }
  }
}
</script>
