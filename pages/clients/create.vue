<template>
  <div class="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <t-card-page title="Создание нового клиента">
      <v-form ref="form" class="w-full mx-auto">
        <div class="space-y-6">
          <div class="rounded-2xl bg-white/80 shadow-sm p-3">
            <div class="mb-4">
              <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Основные данные</div>
              <div class="text-base font-semibold text-slate-800">Профиль клиента</div>
            </div>
            <v-row class="px-1">
              <v-col cols="4">
                <v-text-field
                  ref="lastname"
                  label="Фамилия"
                  v-model="client.lastname"
                  :rules="[() => !!client.lastname || 'Поле фамилия обязательно для заполнения']"
                  required
                  :error="!!validationErrors.name"
                  :error-messages="validationErrors.name"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Имя"
                  ref="firstname"
                  v-model="client.firstname"
                  :rules="[() => !!client.firstname || 'Поле имя обязательно для заполнения']"
                  required
                  :error="!!validationErrors.name"
                  :error-messages="validationErrors.name"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Отчество"
                  ref="patronymic"
                  v-model="client.patronymic"
                  :rules="[() => !!client.patronymic || 'Поле отчество обязательно для заполнения']"
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
              <v-col cols="6">
                <v-text-field
                  ref="birth_date"
                  label="Дата рождения"
                  v-model="client.birth_date"
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
              <v-col cols="6">
                <v-select
                  label="Клуб"
                  v-model="client.club_id"
                  :items="clubs"
                  item-value="id"
                  item-text="name"
                  ref="club_id"
                  :disabled="!IS_BOSS"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="!IS_BOSS"
                  ref="pass"
                  label="Карта"
                  v-model="client.pass"
                  :error="!!validationErrors.pass"
                  :error-messages="validationErrors.pass"
                  :rules="[
                    () => !!client.pass || 'Поле карта обязательно для заполнения',
                  ]"
                />
                <v-text-field
                  v-else
                  ref="pass"
                  label="Карта"
                  v-model="client.pass"
                  hint="Можно оставить поле пустым, если нет необходимости"
                  persistent-hint
                  :error="!!validationErrors.pass"
                  :error-messages="validationErrors.pass"
                />
              </v-col>
              <v-col cols="6" v-show="!isWomenClubChosen">
                <v-select
                  label="Пол"
                  v-model="client.gender"
                  :items="genders"
                  item-value="id"
                  item-text="value"
                  ref="gender"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea label="Заметка о клиенте" v-model="client.description"/>
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
              Проверьте данные перед созданием.
            </div>
            <v-btn type="button" color="primary" @click="_onSubmit">
              Создать <Check :size="18" class="ml-1" />
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
import useWebcamMixin from '@/utils/mixins/useWebcamMixin';
import {__hardcoded} from '@/utils/helpers';
import userMixin from '@/mixins/userMixin';
import { Camera, Check, Upload } from 'lucide-vue';

export default {
  components: { Camera, Check, Upload },
  data: () => ({
    genders: GENDERS,
    photoPreview: null,
    client_video: null,
    client: {
      lastname: '',
      firstname: '',
      patronymic: '',
      phone: '',
      gender: 'F',
      birth_date: null,
      pass: '',
      description: '',
      club_id: 1,
    },
    maxDate: moment().format('YYYY-MM-DD'),
    validationErrors: {}
  }),
  mixins: [useWebcamMixin, userMixin],
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS',
    }),
    name () {
      return (`${this.client.lastname} ${this.client.firstname} ${this.client.patronymic.length === 1 ? '' : this.client.patronymic}`).trim();
    },
    form () {
      let _form = {
        firstname: this.client.firstname,
        lastname: this.client.lastname,
        patronymic: this.client.patronymic,
        phone: this.client.phone,
        birth_date: this.client.birth_date,
        gender: this.client.gender,
      };

      if (!this.IS_BOSS) {
        _form.pass = this.client.pass;
      }
      return _form;
    },
    isWomenClubChosen () {
      return this.client.club_id === __hardcoded(1);
    }
  },
  async mounted () {
    this.client.club_id = this.$currentClub;
    try {
      await this.initWebcam();
    } catch (e) {
      console.log(e);
    }
    this.$on('webcam:photo', ({ photoPreview, file }) => {
      this.photoPreview = photoPreview;
      this.client.photo = file;
    });

  },
  beforeDestroy() {
    this.stopWebcam();
  },
  methods: {
    ...mapActions({
      '$createClient': 'clients/createClient'
    }),
    async _onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        this.$loader.enable('Идет создание клиента...');
        const client = await this.$createClient(this._getClientObject());
        await this.$router.push(`/clients/${client.id}`);
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    },
    _getClientObject () {
      const client = {...this.client};
      client.name = this.name;
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
        if (!this.form[f]) {
          console.log(f);
          errors.push(true);
        }
        this.$refs[f].validate(true);
      })
      return errors.length === 0;
    },
    async capturePhoto () {
      this._capturePhoto();
    },
  },
  watch: {
    isWomenClubChosen: {
      immediate: true,
      handler: function (value) {
        this.client.gender = value ? 'F' : 'M';
      }
    }
  },
}
</script>

<style scoped lang="scss">

</style>
