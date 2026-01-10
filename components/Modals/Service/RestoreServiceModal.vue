<template>
  <base-modal
    v-bind="$attrs"
    :state="state"
    @close="$emit('close')"
  >
    <template #default>
      <p class="font-medium text-base">
        Данная программа будет восстановлена
      </p>
      <p class="font-medium text-base">
        Срок продления составит - {{ diffInDays }} {{ diffInDays === 1 ? 'день' : 'дня/дней' }}.
      </p>
      <p class="font-medium text-base">
        Программа будет активна до {{ dateFormatted }}
      </p>
      <p class="font-medium text-base">
        Стоимость восстановления: {{ restorePrice }}
      </p>
      <input type="file" class="hidden" ref="fileInput" @change="onFileInputChange">
      <v-btn color="primary" class="my-4" @click="$refs.fileInput.click()" v-if="!uploadedDocument">
        Загрузить документ <Upload :size="18" class="ml-1" />
      </v-btn>
      <v-list v-if="uploadedDocument">
        <t-list-item title="Загруженный документ">
          {{ uploadedDocument.name }}
          <template #action>
            <v-btn icon color="error" @click="uploadedDocument = null;">
              <X :size="18" />
            </v-btn>
          </template>
        </t-list-item>
      </v-list>
      <div v-show="canBeChanged">
        <v-checkbox
          :dense="true"
          label="Восстановить бесплатно"
          v-model="isFree"
        />
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          class="-mt-2"
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="dateFormatted"
              label="Произвольная дата восстановления"
              persistent-hint
              v-bind="attrs"
              v-on="on"
            >
              <template v-slot:prepend>
                <Calendar :size="18" class="text-gray-400" />
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            :first-day-of-week="1"
            v-model="date"
            :min="minCalendar"
            no-title
            @change="dateMenu = false"
          ></v-date-picker>
        </v-menu>
      </div>
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="_onSubmit" color="success">
        Восстановить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {formatPrice, toFormData} from '@/utils/helpers';
import {diffInDaysToday, todayForCalendar} from '@/utils/support/DateFunctions';
import { Calendar, Check, Upload, X } from 'lucide-vue';
export default {
  components: { Calendar, Check, Upload, X },
  data: () => ({
    isFree: false,
    dateMenu: false,
    date: null,
    minCalendar: todayForCalendar(),
    uploadedDocument: null,
    uploadedDocumentName: '',
  }),
  props: {
    service: {
      type: Object,
      default: () => ({})
    },
    state: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT',
    }),
    restorePrice () {
      return this.isFree ? 'Бесплатно' : formatPrice(this.service.restore_price);
    },
    dateFormatted () {
      return this.toReadableDate(this.date);
    },
    diffInDays () {
      return diffInDaysToday(this.date);
    },
    canBeChanged () {
      return !!this.uploadedDocument;
    }
  },
  methods: {
    ...mapActions({
      '$restoreService': 'clients/restoreService',
    }),
    onFileInputChange (e) {
      const file = e.target.files[0];
      if (!file) {
        return false;
      }
      this.uploadedDocument = file;
      this.$refs.fileInput.value = null;
    },
    async _onSubmit () {
      const payload = {
        service_id: this.service.service_id,
        client_id: this.client.id,
        restore_price: this.isFree ? 0 : this.service.restore_price,
        base_restore_price: this.service.restore_price,
        restore_until: this.date,
        base_restore_until: this.parseDate(this.service.active_until_restored),
        previous_active_until: this.service.active_until,
      };

      if (this.uploadedDocument) {
        payload.document = this.uploadedDocument;
      }
      try {
        await this.$restoreService({ payload: toFormData(payload), serviceId: this.service.id });
        this.$loader.enable('Пожалуйста, подождите...');
        this.$emit('close');
      } catch (e) {
        console.log(e);
      } finally {
        this.$loader.disable();
      }
    },
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('.')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    toReadableDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
    }
  },
  watch: {
    state (value) {
      if (value) {
        this.date = this.parseDate(this.service.active_until_restored);
      } else {
        this.isFree = false;
        this.dateMenu = false;
        this.date = null;
      }
    },
    uploadedDocument (value) {
      if (!value) {
        this.isFree = false;
        this.date = this.parseDate(this.service.active_until_restored);
        this.uploadedDocumentName = '';
      }
    }
  },
}
</script>

<style scoped lang="scss">

</style>
