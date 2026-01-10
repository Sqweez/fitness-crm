<template>
  <div>
    <v-card>
      <v-card-title>
        Создание нового клиента
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
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
            <v-col cols="4">
              <v-text-field
                ref="phone"
                v-model="client.phone"
                label="Телефон"
                v-mask="'+7 (###) ### ##-##'"
                :rules="[
                () => !!client.phone || 'Поле телефон обязательно для заполнения',
                () => !!client.phone && client.phone.length === 18 || 'Телефон должен быть заполнен полностью'
              ]"
                required
                :error="!!validationErrors.phone"
                :error-messages="validationErrors.phone"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                ref="birth_date"
                label="Дата рождения"
                v-model="client.birth_date"
                v-mask="'##.##.####'"
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
              <v-radio-group label="Клуб" v-model="client.club_id" row :disabled="!IS_BOSS">
                <v-radio
                  v-for="club of clubs"
                  :key="club.name"
                  :label="club.name"
                  :value="club.id" />
              </v-radio-group>
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
              <v-radio-group label="Пол" v-model="client.gender" row ref="gender">
                <v-radio
                  v-for="gender of genders"
                  :key="gender.value"
                  :label="gender.value"
                  :value="gender.id" />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <div class="flex items-center gap-x-4 my-4">
                <div class="w-96 h-96 overflow-hidden" v-show="isClientVideoEnabled">
                  <video autoplay class="w-full h-full object-cover" ref="webcam"/>
                </div>
                <div class="w-96 h-96 overflow-hidden" v-if="photoPreview">
                  <img :src="photoPreview" class="w-full h-full object-cover">
                </div>
                <canvas ref="canvas" width="384" height="384" v-show="false"></canvas>
              </div>
              <input type="file" accept="image/*" ref="fileInput" @change="_onFileInputChange" class="hidden">
              <v-btn color="primary" @click="$refs.fileInput.click()">
                Загрузить фото <Upload :size="18" class="ml-1" />
              </v-btn>
              <v-btn color="primary" @click="capturePhoto" v-show="isClientVideoEnabled">
                Сфотографировать <Camera :size="18" class="ml-1" />
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Заметка о клиенте" v-model="client.description"/>
            </v-col>
          </v-row>
          <v-btn type="button" color="primary" @click="_onSubmit">
            Создать <Check :size="18" class="ml-1" />
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
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
