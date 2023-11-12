<template>
  <div>
    <solarium-modal :state="showSolariumModal" @close="showSolariumModal = false" />
    <v-expansion-panels class="mt-4 mb-2" v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header color="orange darken-2">
          <h5 class="text-white"><b>Солярий</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="p-4">
            <b>Доступно солярия в минутах: {{ client.total_solarium }}</b>
            <div class="my-4">
              <v-btn @click="showSolariumModal = true" color="success" v-if="client.total_solarium > 0 && $CAN_WRITE_OFF_SERVICES">
                Списать солярий
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import userMixin from '@/mixins/userMixin';

export default {
  data: () => ({
    showSolariumModal: false,
    panel: [0]
  }),
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    }),
  },
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
