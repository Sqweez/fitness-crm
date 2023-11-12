<template>
  <div>
    <v-row>
      <v-col cols="12" v-show="!simple">
        <v-select
          :items="dateFilters"
          item-text="name"
          item-value="value"
          v-model="currentDate"
          label="Время:"
          @change="updateValue"
        />
      </v-col>
      <v-col v-show="currentDate === 4 || simple" cols="12">
        <label v-if="!simple">Произвольная дата</label>
        <v-menu
          ref="startMenu"
          v-model="startMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="start"
          transition="scale-transition"
          min-width="290px"
          offset-y
          full-width
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="start"
              label="Дата начала"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :first-day-of-week="1"
            v-model="start"
            locale="ru"
            no-title
            scrollable
          >
            <div class="flex-grow-1"></div>
            <v-btn
              text
              outlined
              color="primary"
              @click="startMenu = false"
            >
              Отмена
            </v-btn>
            <v-btn
              text
              outlined
              color="primary"
              @click="changeCustomDate(startMenu, start)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="finishMenu"
          v-model="finishMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="finish"
          transition="scale-transition"
          min-width="290px"
          offset-y
          full-width
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="finish"
              label="Дата окончания"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :first-day-of-week="1"
            v-model="finish"
            locale="ru"
            no-title
            scrollable
          >
            <div class="flex-grow-1"></div>
            <v-btn
              text
              outlined
              color="primary"
              @click="finishMenu = false"
            >
              Отмена
            </v-btn>
            <v-btn
              text
              outlined
              color="primary"
              @click="changeCustomDate(finishMenu, finish) "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment/moment';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FILTERS = {
  ALL_TIME: 1,
  CURRENT_MONTH: 2,
  TODAY: 3,
  CUSTOM_FILTER: 4,
  LAST_3_DAYS: 5,
};
export default {
  name: 'TDatePicker',
  props: {
    simple: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    dateFilters: [
      {
        name: 'Сегодня',
        value: [
          moment().format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
        ],
      },
      {
        name: 'Вчера',
        value: [
          moment().subtract(1, 'days').format(DATE_FORMAT),
          moment().subtract(1, 'days').format(DATE_FORMAT),
        ],
      },
      {
        name: 'Последние 3 дня',
        value: [
          moment().subtract(3, 'days').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
        ],
      },
      {
        name: 'За текущий месяц',
        value: [
          moment().startOf('month').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
        ],
      },
      {
        name: 'За все время',
        value: [
          moment.unix(1).format(DATE_FORMAT),
          moment().format(DATE_FORMAT)
        ],
      },
      {
        name: 'Произвольно',
        value: DATE_FILTERS.CUSTOM_FILTER
      },
    ],
    currentDate:  [
      moment().format(DATE_FORMAT),
      moment().format(DATE_FORMAT),
    ],
    start: null,
    startMenu: null,
    finish: null,
    finishMenu: null,
  }),
  computed: {},
  mounted () {
    if (this.$attrs.value.length === 2) {
      this.start = this.$attrs.value[0];
      this.finish = this.$attrs.value[1];
      this.changeCustomDate();
    }
  },
  methods: {
    changeCustomDate () {
      this.$refs.startMenu.save(this.start);
      this.$refs.finishMenu.save(this.finish);
      if (this.start && this.finish) {
        this.$emit('input', [
          this.start,
          this.finish
        ])
      }
    },
    updateValue (value) {
      //console.log(value);
    }
  },
  watch: {
    currentDate: {
      immediate: true,
      deep: true,
      handler: function (value) {
        if (Array.isArray(value) && !this.simple) {
          this.$emit('input', value);
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
