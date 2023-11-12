<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header color="yellow darken-3">
          <h5 class="text-white"><b>Текущая сессия</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="p-4">
            <trinket-modal :state="showTrinketModal" @close="showTrinketModal = false"/>
            <div class="flex flex-col gap-y-4">
              <h2 v-if="client.trinket" class="headline">
                Номер шкафчика: {{ client.cabinet_number }}
              </h2>
              <v-btn
                color="primary"
                @click="showTrinketModal = true"
                v-if="client.trinket_can_given"
              >
                Выдать ключ <v-icon>mdi-key</v-icon>
              </v-btn>
              <v-btn
                dark
                color="red lighten-1"
                @click="_onFinishVisitClick"
                v-if="client.session_can_be_finished || client.trinket_can_given"
              >
                Завершить посещение <v-icon>mdi-cancel</v-icon>
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data: () => ({
    panel: [0],
    showTrinketModal: false,
  }),
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    })
  },
  methods: {
    ...mapActions({
      $finishVisit: 'clients/finishVisit',
    }),
    _onFinishVisitClick () {
      this.$confirm(`Вы действительно хотите завершить сеанс клиента ${this.client.name}?`)
        .then(async _ => {
          try {
            this.$loader.enable();
            await this.$finishVisit();
          } catch (e) {
            //
          } finally {
            this.$loader.disable();
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
