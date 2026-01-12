<template>
  <div class="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <t-card-page title="Редактирование данных клиента">
      <v-form ref="form" v-if="IS_CLIENT_LOADED" class="w-full mx-auto">
        <div class="space-y-6">
          <div class="rounded-2xl  bg-white/80 shadow-sm p-3">
            <div class="mb-4">
              <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Основные данные</div>
              <div class="text-base font-semibold text-slate-800">Профиль клиента</div>
            </div>
            <v-row class="px-1">
              <v-col cols="12" v-show="IS_BOSS">
                <v-text-field
                  ref="name"
                  label="ФИО"
                  v-model="client.name"
                  :rules="[() => !!client.name || 'Поле ФИО обязательно для заполнения']"
                  required
                  :error="!!validationErrors.name"
                  :error-messages="validationErrors.name"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  ref="phone"
                  v-model="client.phone"
                  label="Телефон"
                  v-mask="'+7 (###) ### ##-##'"
                  maxlength="18"
                  :rules="[
                    () => !!client.phone || 'Поле телефон обязательно для заполнения',
                    () => !!client.phone && client.phone.length === 18 || 'Телефон должен быть заполнен полностью'
                  ]"
                  required
                  :error="!!validationErrors.phone"
                  :error-messages="validationErrors.phone"
                />
              </v-col>
              <v-col cols="6" v-show="IS_BOSS">
                <v-text-field
                  ref="birth_date"
                  label="Дата рождения"
                  v-model="client.birth_date_formatted"
                  v-mask="'##.##.####'"
                  maxlength="10"
                  hint="День.месяц.год"
                  :rules="[
                    () => !!client.birth_date || 'Поле дата рождения обязательно для заполнения',
                    () => !!client.birth_date && client.birth_date.length === 10 || 'Дата рождения заполнена некорректно'
                  ]"
                  required
                  :error="!!validationErrors.birth_date"
                  :error-messages="validationErrors.birth_date"
                />
              </v-col>
              <v-col cols="6" v-show="IS_BOSS">
                <v-select
                  label="Клуб"
                  v-model="client.club.id"
                  :items="clubs"
                  item-value="id"
                  item-text="name"
                  ref="club_id"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  label="Пол"
                  v-model="client.gender"
                  :items="genders"
                  item-value="id"
                  item-text="value"
                  ref="gender"
                />
              </v-col>
            </v-row>
          </div>

          <div class="rounded-2xl bg-white/80 shadow-sm p-3">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Фото</div>
                <div class="text-base font-semibold text-slate-800">Портрет клиента</div>
              </div>
              <div class="text-xs text-slate-500">Загрузите или сделайте фото</div>
            </div>
            <div class="flex flex-wrap items-center gap-4">
              <div class="w-96 h-96 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" v-show="isClientVideoEnabled">
                <video autoplay class="w-full h-full object-cover" ref="webcam"/>
              </div>
              <div class="w-96 h-96 overflow-hidden rounded-2xl border border-slate-200 bg-white" v-if="photoPreview">
                <img :src="photoPreview" class="w-full h-full object-contain object-center">
              </div>
              <div class="flex-1 min-w-[220px] text-sm text-slate-600">
                Фото используется в карточке клиента и помогает быстрее идентифицировать человека в списках и расписании.
              </div>
              <canvas ref="canvas" width="384" height="384" v-show="false"></canvas>
            </div>
            <div class="mt-4 flex flex-wrap gap-3">
              <input type="file" accept="image/*" ref="fileInput" @change="_onFileInputChange" class="hidden">
              <v-btn color="primary" @click="$refs.fileInput.click()">
                Загрузить фото <Upload :size="18" class="ml-1" />
              </v-btn>
              <v-btn color="primary" @click="capturePhoto" v-show="isClientVideoEnabled">
                Сфотографировать <Camera :size="18" class="ml-1" />
              </v-btn>
            </div>
          </div>

          <div class="flex items-center justify-between bg-white/80 shadow-sm px-3 py-2.5">
            <div class="text-sm text-slate-600">
              Проверьте данные перед сохранением.
            </div>
            <v-btn type="button" color="primary" @click="_onSubmit">
              Сохранить <Check :size="18" class="ml-1" />
            </v-btn>
          </div>
        </div>
      </v-form>
    </t-card-page>
  </div>
</template>

<script>
import moment from 'moment';
import GENDERS from "@/utils/enums/GENDERS";
import {mapActions, mapGetters} from "vuex";
import {deepClone} from "@/utils/helpers";
import useWebcamMixin from '@/utils/mixins/useWebcamMixin';
import userMixin from '@/mixins/userMixin';
import { Camera, Check, Upload } from 'lucide-vue';

export default {
  components: { Camera, Check, Upload },
  data: () => ({
    genders: GENDERS,
    photoPreview: null,
    isClientVideoEnabled: false,
    maxDate: moment().format('YYYY-MM-DD'),
    validationErrors: {}
  }),
  mixins: [useWebcamMixin, userMixin],
  async mounted() {
    if (!this.IS_CLIENT_LOADED) {
      this.$loader.enable();
      await this.$getClient(this.id);
      this.$loader.disable();
    }
    await this.initWebcam();
    this.$on('webcam:photo', ({ photoPreview, file }) => {
      this.photoPreview = photoPreview;
      this.client.photo = file;
    });
  },
  beforeDestroy() {
    this.isClientVideoEnabled = false;
    this.stopWebcam();
  },
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS',
      _client: 'clients/CLIENT',
    }),
    id () {
      return +this.$route.params.id;
    },
    IS_CLIENT_LOADED () {
      return this._client && this.client.id === this.id;
    },
    client () {
      return deepClone(this._client);
    },
    form () {
      return {
        name: this.client.name,
        phone: this.client.phone,
        birth_date: this.client.birth_date,
        gender: this.client.gender,
      }
    },
  },
  methods: {
    ...mapActions({
      '$getClient': 'clients/getClient',
      '$updateClient': 'clients/updateClient'
    }),
    async _onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        this.$loader.enable('Идет редактирование клиента...');
        await this.$updateClient(this._getClientObject());
        await this.$router.back();
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    },
    _getClientObject () {
      const client = {
        name: this.client.name,
        club_id: this.client.club.id,
        photo: this.client.photo,
        description: this.client.description,
        phone: this.client.phone,
        id: this.client.id,
        birth_date: this.client.birth_date_formatted,
      };
      if (!this.client.photo || !(this.client.photo instanceof Object)) {
        delete client.photo;
      }
      const formData = new FormData();
      Object.keys(client).forEach(key => {
        formData.append(key, client[key]);
      })
      return formData;
    },
    _onFileInputChange (e) {
      const file = e.target.files[0];
      if (file) {
        this.client.photo = file;
        this.photoPreview = window.URL.createObjectURL(file);
        this.$refs.fileInput.value = null;
      }
    },
    _validateForm () {
      let errors = [];
      this.validationErrors = {};
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) errors.push(true);
        this.$refs[f].validate(true);
      })
      return errors.length === 0;
    },
    capturePhoto () {
      this._capturePhoto();
    },
  }
}
</script>

<style scoped lang="scss">

</style>
