<template>
  <base-modal
    :max-width="700"
    title="Разморозка карты"
    @close="$emit('close')"
    :state="state"
  >
    <template #default v-if="state">
      <p>
        Сотрудник: {{ service.active_stop.user.name }}
      </p>
      <p>
        Дата заморозки: {{ service.active_stop.created_at_formatted }}
      </p>
      <p>
        Остаток программы в днях: {{ service.active_stop.remaining_days }}
      </p>
      <p>
        Программа будет активна до: {{ service.active_stop.new_active_until }}
      </p>
      <p>
        Комментарий: {{ service.active_stop.description }}
      </p>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text color="success" @click="_onSubmit">
        Разморозить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import { Check } from 'lucide-vue';

export default {
  components: { Check },
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
      $unStopCard: 'clients/unStopCard',
    }),
    async _onSubmit () {
      const payload = {
        /* service_sale_id: this.service.id,
         active_until_prev: this.service.active_until,
         is_active: true,
         description: this.description*/
        id: this.service.id,
        client_id: this.client.id,
      };
      this.$loader.enable();
      await this.$unStopCard(payload);
      this.$loader.disable();
      this.$emit('close');
    },
  }
}
</script>

<style scoped lang="scss">

</style>
