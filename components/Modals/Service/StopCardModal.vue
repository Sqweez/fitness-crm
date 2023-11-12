<template>
  <base-modal
    :max-width="700"
    title="Заморозка карты"
    @close="$emit('close')"
    :state="state"
  >
    <template #default>
      <v-textarea
        title="Причина"
        label="Причина"
        v-model="description"
      />
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text color="success" @click="_onSubmit">
        Заморозить <v-icon>mdi-check</v-icon>
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  props: {
    state: {
      type: Boolean,
      required: true
    },
    service: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    description: '',
  }),
  watch: {
    state () {
      this.description = '';
    },
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    })
  },
  methods: {
    ...mapActions({
      $stopCard: 'clients/stopCard',
    }),
    async _onSubmit () {
      const payload = {
        id: this.service.id,
        service_sale_id: this.service.id,
        active_until_prev: this.service.active_until,
        client_id: this.client.id,
        is_active: true,
        description: this.description
      };
      this.$loader.enable();
      await this.$stopCard(payload);
      this.$loader.disable();
      this.$emit('close');
    },
  }
}
</script>

<style scoped lang="scss">

</style>
