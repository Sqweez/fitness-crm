<template>
  <div>
    <t-card-page title="Экономические данные за период">
      <v-row>
        <v-col cols="12" xl="6">
          <v-tabs v-model="tab">
            <v-tab>Пополнение карт</v-tab>
            <v-tab>Покупка программ</v-tab>
            <v-tab>Гости клуба</v-tab>
            <v-tab>Новые клиенты</v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" xl="3">
          <v-select
            :items="periods"
            item-text="name"
            item-value="value"
            v-model="period"
            label="Время:"
          />
        </v-col>
        <v-col cols="12" xl="3" v-if="period === PERIOD_CUSTOM">
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="dates"
            transition="scale-transition"
            min-width="auto"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="customRangeText"
                label="Произвольный период"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker
              :first-day-of-week="1"
              v-model="dates"
              no-title
              scrollable
              range
            >
              <div class="flex-grow-1"></div>
              <v-btn text outlined color="primary" @click="dateMenu = false">
                Отмена
              </v-btn>
              <v-btn text outlined color="primary" @click="applyCustomDates">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xl="6">
          <v-select
            v-model="clubId"
            :items="clubs"
            label="Клуб"
            item-text="name"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" xl="6">
          <v-autocomplete
            v-model="userId"
            :items="users"
            label="Сотрудник"
            item-text="name"
            item-value="id"
          />
        </v-col>
      </v-row>
      <template v-if="params">
        <economy-v2-top-ups v-if="tab === 0" :params="params" />
        <economy-v2-programs v-else-if="tab === 1" :params="params" />
        <economy-v2-guests v-else-if="tab === 2" :params="params" />
        <economy-v2-new-clients v-else-if="tab === 3" :params="params" />
      </template>
    </t-card-page>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

const DATE_FORMAT = 'YYYY-MM-DD';
const PERIOD_CUSTOM = 'custom';

const RANGES = {
  today: () => [moment(), moment()],
  yesterday: () => [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  last3days: () => [moment().subtract(3, 'days'), moment()],
  month: () => [moment().startOf('month'), moment()],
  all: () => [moment.unix(1), moment()],
};

export default {
  data: () => ({
    PERIOD_CUSTOM,
    tab: 0,
    period: 'today',
    periods: [
      { name: 'Сегодня', value: 'today' },
      { name: 'Вчера', value: 'yesterday' },
      { name: 'Последние 3 дня', value: 'last3days' },
      { name: 'За текущий месяц', value: 'month' },
      { name: 'За все время', value: 'all' },
      { name: 'Произвольно', value: PERIOD_CUSTOM },
    ],
    dateMenu: null,
    dates: [],
    customDates: [],
    clubId: -1,
    userId: -1,
  }),
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS_FILTERS',
      users: 'users/USERS_ECONOMY_FILTER',
    }),
    customRangeText () {
      return this.dates.map(d => d.split('-').reverse().join('.')).join('~');
    },
    // null until a custom range is confirmed, so nothing is requested without dates
    params () {
      let range;
      if (this.period === PERIOD_CUSTOM) {
        if (this.customDates.length !== 2) {
          return null;
        }
        range = this.customDates;
      } else {
        range = RANGES[this.period]().map(d => d.format(DATE_FORMAT));
      }
      return {
        start: range[0],
        finish: range[1],
        club_id: this.clubId !== -1 ? this.clubId : undefined,
        user_id: this.userId !== -1 ? this.userId : undefined,
      };
    },
  },
  methods: {
    applyCustomDates () {
      this.$refs.dateMenu.save(this.dates);
      this.customDates = [...this.dates].sort();
    },
  },
}
</script>
