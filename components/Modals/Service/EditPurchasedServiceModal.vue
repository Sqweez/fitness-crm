<template>
  <base-modal
    v-bind="$attrs"
    :state="state"
    @close="$emit('close')"
    :max-width="700"
  >
    <template #default>
      <v-text-field
        label="Собственное название"
        v-model="name"
      />
      <v-text-field
        v-if="remainingVisits !== true"
        label="Осталось посещений"
        v-model="remainingVisits"
        type="number"
      />
      <h3 class="font-semibold">
        Активно до:
      </h3>
      <v-row justify="start" class="my-2 ml-1">
        <v-date-picker v-model="activeUntil" :first-day-of-week="1"/>
      </v-row>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn color="success" text @click="onSubmit">
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {deformatDate} from '@/utils/helpers';
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    activeUntil: null,
    remainingVisits: null,
    name: '',
  }),
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    })
  },
  methods: {
    ...mapActions({
      $updatePurchasedService: 'clients/updatePurchasedService',
    }),
    async onSubmit () {
      const payload = {
        self_name: this.name,
        active_until: this.activeUntil,
      };

      if (this.remainingVisits !== true) {
        payload.entries_count = this.service.initial_entries_count + (this.remainingVisits - this.service.remaining_visits);
      }

      this.$loader.enable();
      try {
        await this.$updatePurchasedService({
          serviceId: this.service.id,
          payload
        });
        this.$emit('close');
      } catch (e) {}
      finally {
        this.$loader.disable();
      }
    },
  },
  watch: {
    state (value) {
      if (value) {
        this.activeUntil = deformatDate(this.service.active_until);
        this.remainingVisits = this.service.remaining_visits;
        this.name = this.service.name;
      } else {
        this.activeUntil = null;
        this.remainingVisits = null;
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
