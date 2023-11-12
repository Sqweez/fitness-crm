<template>
  <div>
    <v-row>
      <v-col cols="12">
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
              label="Дата"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :first-day-of-week="1"
            :max="this.$attrs.max"
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'TSingleDatePicker',
  props: {
    simple: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    if (this.$attrs.value) {
      this.$nextTick(() => {
        this.start = this.$attrs.value;
        this.changeCustomDate();
      })
    }
  },
  data: () => ({
    start: null,
    startMenu: null,
  }),
  methods: {
    changeCustomDate () {
      this.$refs.startMenu.save(this.start);
      if (this.start) {
        this.$emit('input', this.start)
      }
    },
    updateValue (value) {
      //console.log(value);
    }
  },
}
</script>

<style scoped lang="scss">

</style>
