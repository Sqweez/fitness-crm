<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header color="blue darken-2">
          <h5 class="text-white"><b>Купленные программы</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-tabs v-model="tab" color="blue darken-2" class="mb-4">
            <v-tab
            v-for="item in tabs"
            :key="item.title"
            >
            {{ item.title }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="item in tabs"
              :key="item.title"
            >
              <p v-if="!filteredPrograms.length" class="my-2">
                Нет доступных программ
              </p>
              <v-expansion-panels v-else>
                <v-expansion-panel v-for="item of filteredPrograms" :key="item.id" class="my-2">
                  <v-expansion-panel-header :color="getColor(item)">
                    <h5 class="text-white">
                      <b>{{ item.name }} ({{ item.club.name }})</b>
                    </h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="flex gap-x-2 items-center justify-start">
                      <v-list flat class="flex-1">
                        <t-list-item title="Осталось посещений" v-if="item.remaining_visits !== true">
                          {{ item.remaining_visits }}
                        </t-list-item>
                        <t-list-item title="Штрафных посещений" v-if="item.penalties_count" error>
                          <span class="text-red-500">{{ item.penalties_count }}</span>
                        </t-list-item>
                        <t-list-item title="Использовано посещений">
                          {{ item.visits_count }}
                        </t-list-item>
                        <t-list-item title="Активно до" v-if="item.active_until">
                          {{ item.active_until }}
                        </t-list-item>
                        <t-list-item title="Осталось дней" v-if="item.days_remaining">
                          {{ item.days_remaining }}
                        </t-list-item>
                        <t-list-item title="Активирована" v-if="!item.is_activated">
                          <status-icons :state="item.is_activated" />
                        </t-list-item>
                        <t-list-item title="Безлимит" v-if="item.is_unlimited">
                          <status-icons :state="item.is_unlimited" />
                        </t-list-item>
                        <t-list-item title="Последний тренер">
                          {{ item.last_trainer.name }}
                        </t-list-item>
                      </v-list>
                      <div class="flex flex-col gap-y-2 w-64">
                        <v-btn color="primary" v-if="!item.is_activated && $CAN_WRITE_OFF_SERVICES" @click="_onWriteOffClick(item)">
                          Списать <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn color="primary" v-if="item.can_be_used && $CAN_WRITE_OFF_SERVICES" @click="_onWriteOffClick(item)">
                          Списать <span v-if="item.already_written_off">&nbsp;повторно</span><v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn color="red darken-1" dark v-if="item.can_be_used && $CAN_WRITE_OFF_SERVICES" @click="_onPenaltyWriteOffClick(item)">
                          Штрафное списание <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn color="indigo darken-1" dark v-if="item.can_be_prolonged && client.has_unlimited_discount" @click="_onServiceProlong(item)">
                          Пролонгация ({{ item.prolongation_price | priceFilters }})
                        </v-btn>
                        <v-btn
                          color="cyan darken-2"
                          dark
                          v-if="item.can_be_used && !item.is_stopped"
                          @click="currentService = {...item}; showStopCardModal = true;"
                        >
                          Заморозить карту
                        </v-btn>
                        <v-btn
                          color="cyan darken-2"
                          dark
                          v-if="item.is_stopped && IS_BOSS"
                          @click="currentService = {...item}; showUnStopCardModal = true;"
                        >
                          Разморозить карту
                        </v-btn>
                        <v-btn
                          color="cyan lighten-1" dark
                          v-if="item.can_be_restored"
                          @click="_onRestoreClick(item)"
                        >
                          Восстановить ({{ item.restore_price | priceFilters }})
                        </v-btn>
                        <v-btn color="pink darken-1" style="color:#fff;" @click="_onServiceInformationClick(item)">
                          Информация <v-icon>mdi-information-outline</v-icon>
                        </v-btn>
                        <v-btn color="orange darken-2" v-if="IS_BOSS" @click="_onEditClick(item)" dark>
                          Редактировать <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-tab-item>
          </v-tabs-items>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <service-write-off-modal
      :service="currentService"
      :state="showWriteOffModal"
      :penalty="isPenalty"
      @close="_onWriteOffModalClose"
      @submit="showTrinketModal = true"
    />
    <lazy-stop-card-modal
      :service="currentService"
      :state="showStopCardModal"
      @close="showStopCardModal = false; currentService = {}"
    />
    <lazy-un-stop-card-modal
      :service="currentService"
      :state="showUnStopCardModal"
      @close="showUnStopCardModal = false; currentService = {}"
    />
    <restore-service-modal
      :service="currentService"
      :state="showRestoreModal"
      title="Восстановление просроченной программы"
      :max-width="800"
      @close="showRestoreModal = false; currentService = {}"
    />
    <lazy-purchase-service-information-modal
      :state="showServiceInformationModal"
      :service="currentService"
      title="Информация о купленной программе"
      @close="showServiceInformationModal = false; currentService = {}"
    />
    <lazy-edit-purchased-service-modal
      :state="showEditModal"
      :service="currentService"
      title="Редактирование купленной программы"
      @close="showEditModal = false; currentService = {};"
    />
    <trinket-modal
      :state="showTrinketModal"
      @close="showTrinketModal = false"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  data: () => ({
    panel: [0],
    tab: 0,
    showStopCardModal: false,
    showUnStopCardModal: false,
    showRestoreModal: false,
    showServiceInformationModal: false,
    showTrinketModal: false,
    showWriteOffModal: false,
    showEditModal: false,
    isPenalty: false,
    currentService: {},
    tabs: [
      {
        title: 'Все',
        value: 0,
      },
      {
        title: 'Активные',
        value: 1,
      },
      {
        title: 'Замороженные',
        value: 4,
      },
      {
        title: 'Можно восстановить',
        value: 2,
      },
      {
        title: 'Использованные/просроченные',
        value: 3,
      },
    ],
  }),
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    }),
    programs () {
      return this.client.programs;
    },
    filteredPrograms () {
      const idx = +this.tab;
      return this.programs.filter(p => {
        const value = this.tabs[idx].value;
        switch (value) {
          case 0:
            return p;
          case 1:
            return !p.is_stopped && p.can_be_used || !p.is_activated;
          case 2:
            return p.can_be_restored && !p.can_be_used;
          case 3:
            return !p.can_be_used && p.is_activated && !p.can_be_restored;
          case 4:
            return p.is_stopped;
          default:
            return [];
        }
      }).sort((a, b) => b.can_be_used - a.can_be_used);
    }
  },
  methods: {
    ...mapActions({
      $activateProgram: 'clients/activateProgram',
      $writeOffVisit: 'clients/writeOffVisit',
      $prolongService: 'clients/createServiceSale'
    }),
    getColor (item) {
      if (item.is_stopped) {
        return 'blue lighten-2';
      }

      if (!item.is_activated) {
        return 'purple';
      }

      if (item.can_be_used) {
        return 'green';
      }
      if (item.can_be_restored && !item.can_be_used) {
        return 'blue-grey lighten-2';
      }
      if (!item.can_be_used && item.is_activated && !item.can_be_restored) {
        return 'red lighten-1';
      }
      return '';
    },
    _onWriteOffClick (service) {
      this.currentService = service;
      this.showWriteOffModal = true;
    },
    _onServiceInformationClick (service) {
      this.currentService = service;
      this.showServiceInformationModal = true;
    },
    _onRestoreClick (service) {
      if (service.has_unconfirmed_restore_requests) {
        return this.$toast.error('Восстановлении услуги находится на рассмотрении!');
      }
      if (service.restore_price > this.client.balance) {
        return this.$toast.error('Недостаточно средств');
      }
      this.currentService = service;
      this.showRestoreModal = true;
    },
    _onPenaltyWriteOffClick (service) {
      this.isPenalty = true;
      this._onWriteOffClick(service);
    },
    _onServiceProlong (service) {
      const payload = {
        club_id: this.client.club.id,
        client_id: this.client.id,
        service_id: service.service_id,
        is_prolongation: true,
        prolonged_id: service.id,
        amount: service.prolongation_price
      };

      if (this.client.balance < payload.amount) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.$confirm(`Вы действительно хотите продлить услугу "${service.name}" (стоимость продления ${service.unlimited_price})?`)
        .then(async () => {
          await this.$prolongService(payload);
        })
    },
    _onWriteOffModalClose () {
      this.showWriteOffModal = false;
      this.currentService = {};
      this.isPenalty = false;
    },
    _onEditClick (service) {
      this.showEditModal = true;
      this.currentService = service;
    },
  }
}
</script>

<style scoped lang="scss">

</style>
