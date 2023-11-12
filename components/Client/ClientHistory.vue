<template>
  <div>
    <v-expansion-panels class="mt-2">
      <v-expansion-panel>
        <v-expansion-panel-header color="indigo darken-2">
          <h5 class="text-white"><b>История клиента</b></h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <t-date-picker
            simple
            v-model="dates"
          />
          <v-btn
            color="indigo darken-2"
            dark
            class="mb-2"
            @click="onSubmit"
          >
            Получить отчет
          </v-btn>
          <div v-if="isDataLoaded">
            <div v-if="showServicePurchases">
              <v-alert
                border="left"
                color="blue darken-2"
                dark
              >
                История покупок тренировочных программ
              </v-alert>
              <lazy-client-service-purchase-history-table
                :items="clientHistory.service_purchases"
              />
            </div>
            <div v-if="showVisits">
              <v-alert
                border="left"
                color="indigo"
                dark
              >
                История посещений тренировок
              </v-alert>
              <lazy-client-visits-history-table
                :items="clientHistory.visits"
              />
            </div>
            <div v-if="showReplenishments">
              <v-alert
                border="left"
                color="green darken-1"
                dark
              >
                История пополнений баланса
              </v-alert>
              <lazy-client-balance-history-table
                :items="clientHistory.replenishments"
              />
            </div>
            <div v-if="showProductPurchases">
              <v-alert
                border="left"
                color="deep-orange darken-1"
                dark
              >
                История покупок в магазине
              </v-alert>
              <lazy-client-purchase-history-table
                :items="clientHistory.product_purchases"
              />
            </div>
            <div v-if="showBarPurchases">
              <v-alert
                border="left"
                color="red darken-2"
                dark
              >
                История покупок в баре
              </v-alert>
              <lazy-client-purchase-history-table
                :items="clientHistory.bar_purchases"
              />
            </div>
            <div v-if="showServicePurchases">
              <v-alert
                border="left"
                color="orange darken-2"
                dark
              >
                История покупок услуги солярий
              </v-alert>
              <lazy-client-service-purchase-history-table
                :items="clientHistory.solarium_purchases"
              />
            </div>
            <div v-if="showSolarium">
              <v-alert
                border="left"
                color="yellow darken-2"
                dark
              >
                История посещения солярия
              </v-alert>
              <lazy-client-solarium-history-table
                :items="clientHistory.solarium_visits"
              />
            </div>
            <div>
              <v-alert
                border="left"
                dark
                color="purple darken-2"
              >
                Дополнительные услуги
              </v-alert>
              <lazy-client-custom-service-table
                :items="clientHistory.custom_services"
              />
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import moment from 'moment';

export default {
  data: () => ({
    clientHistory: [],
    isDataLoaded: false,
    dateMenu: null,
    dates: [],
    tab: 0,
    tabs: [
      {
        title: 'История пополнения карты',
        value: 0,
      },
      {
        title: 'История покупок',
        value: 1,
      },
      {
        title: 'Покупка тренировочных программ',
        value: 2,
      },
      {
        title: 'История посещений',
        value: 3,
      },
      {
        title: 'История солярия',
        value: 4,
      }
    ],
  }),
  beforeMount() {
    const today = moment().format('YYYY-MM-DD');
    this.dates = [today, today];
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    }),
    isDatesValid () {
      return this.dates.length === 2 && this.dates.every(s => !!s);
    },
    showReplenishments () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    showProductPurchases () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    showBarPurchases () {
      return this.$auth.user.roles.some(r => [1, 2, 3, 4, 8].includes(r.id));
    },
    showServicePurchases () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    showVisits () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    showSolarium () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
  },
  methods: {
    ...mapActions({
      $getClientHistory: 'clients/getClientHistory',
    }),
    changeCustomDate () {
      this.$refs.dateMenu.save(this.dates);
    },
    async onSubmit () {
      if (!this.isDatesValid) {
        return this.$toast.error('Выберите даты!');
      }
      try {
        this.$loader.enable();
        this.isDataLoaded = false;
        const payload = {
          start: this.dates[0],
          finish: this.dates[1]
        };
        const { data } = await this.$getClientHistory(new URLSearchParams(payload));
        this.clientHistory = data.history;
        this.isDataLoaded = true;
      }
      catch (e) {}
      finally {
        this.$loader.disable();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
