<template>
  <base-modal
    :state="state"
    :max-width="500"
    title="Списание средств"
    @close="$emit('close')"
  >
    <template #default>
      <v-text-field
        @keyup.enter="_onSubmit"
        ref="amountInput"
        label="Сумма списания"
        v-model="amount"
      />
      <v-radio-group v-model="paymentType">
        <v-radio
          v-for="item of paymentTypes"
          :key="item.name"
          :label="item.name"
          :value="item.id"
        />
      </v-radio-group>
      <v-text-field
        label="Комментарий"
        v-model="description"
      />
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text @click="_onSubmit" color="success">
        Списать <v-icon>mdi-check</v-icon>
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data: () => ({
    amount: '',
    paymentType: 1,
    description: '',
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
    }),
  },
  watch: {
    state (val) {
      this.amount = '';
      this.description = '';
      this.paymentType = 1;
      if (val) {
        this.$nextTick(() => {
          if (this.$refs.amountInput) {
            this.$refs.amountInput.focus();
          }
        });
      } else {
        if (this.$refs.amountInput) {
          this.$refs.amountInput.blur();
        }
      }
    }
  },
  methods: {
    ...mapActions({
      '$createWithDrawal': 'user/createWithDrawal',
    }),
    async _onSubmit () {
      try {
        this.$emit('close');
        await this.$createWithDrawal({
          amount: this.amount,
          payment_type: this.paymentType,
          description: this.description,
        })
      } catch (e) {

      } finally {
        this.$loader.disable();
      }
    }
  }
}
</script>
