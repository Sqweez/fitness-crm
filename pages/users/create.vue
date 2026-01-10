<template>
  <div>
    <t-card-page title="Добавление сотрудника">
      <v-form ref="form">
        <v-row>
          <v-col cols="4">
            <v-text-field
              ref="lastname"
              label="Фамилия"
              v-model="lastname"
              :rules="[() => !!lastname || 'Поле фамилия обязательно для заполнения']"
              required
              :error="!!validationErrors.name"
              :error-messages="validationErrors.name"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Имя"
              ref="firstname"
              v-model="firstname"
              :rules="[() => !!firstname || 'Поле имя обязательно для заполнения']"
              required
              :error="!!validationErrors.name"
              :error-messages="validationErrors.name"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Отчество"
              v-model="patronymic"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              ref="phone"
              v-model="user.phone"
              label="Телефон"
              v-mask="'+7 (###) ### ##-##'"
              :rules="[
                () => !!user.phone || 'Поле телефон обязательно для заполнения',
                () => !!user.phone && user.phone.length === 18 || 'Телефон должен быть заполнен полностью'
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
              v-model="user.birth_date"
              v-mask="'##.##.####'"
              hint="День.месяц.год"
              :rules="[
                () => !!user.birth_date || 'Поле дата рождения обязательно для заполнения',
                () => !!user.birth_date && user.birth_date.length === 10 || 'Дата рождения заполнена некорректно'
              ]"
              required
              :error="!!validationErrors.birth_date"
              :error-messages="validationErrors.birth_date"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              ref="clubs"
              label="Клуб"
              multiple
              :items="clubs"
              item-text="name"
              item-value="id"
              v-model="user.clubs"
              placeholder="Клуб"
              persistent-placeholder
              :rules="[
                () => user.clubs.length > 0 || 'Выберите клуб!'
              ]"
              required
              :error="!!validationErrors.club_id"
              :error-messages="validationErrors.club_id"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              ref="roles"
              label="Должность"
              :items="roles"
              item-text="name"
              item-value="id"
              v-model="user.roles"
              multiple
              placeholder="Должность"
              persistent-placeholder
              :rules="[
                () => !!user.roles && user.roles.length > 0 || 'Выберите хотя бы одну должность!'
              ]"
              required
              :error="!!validationErrors.roles"
              :error-messages="validationErrors.roles"
            />
          </v-col>
          <v-col cols="12">
            <div class="flex items-center justify-between gap-x-4">
              <div class="flex-1 flex items-center gap-x-3" v-if="false">
                <v-checkbox label="Автогенерация логина" v-model="generateLoginAutomatically"/>
                <v-text-field
                  label="Логин"
                  v-model="user.login"
                  hint="Если оставить пустым, будет сгенерирован из телефона"
                  persistent-hint
                  v-show="!generateLoginAutomatically"
                  :disabled="generateLoginAutomatically"
                  :error="!!validationErrors.login"
                  :error-messages="validationErrors.login"
                />
              </div>
              <div class="flex-1 flex items-center gap-x-3">
                <v-checkbox label="Автогенерация пароля" v-model="generatePasswordAutomatically"/>
                <v-text-field
                  label="Пароль"
                  v-model="user.password"
                  hint="Если оставить пустым, будет сгенерирован случайно"
                  persistent-hint
                  v-show="!generatePasswordAutomatically"
                  :disabled="generatePasswordAutomatically"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Карта"
              v-model="user.pass"
              hint="Можно оставить поле пустым, если нет необходимости"
              persistent-hint
              :error="!!validationErrors.pass"
              :error-messages="validationErrors.pass"
            />
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
            <v-btn color="primary" @click="_capturePhoto" v-show="isClientVideoEnabled">
              Сфотографировать <Camera :size="18" class="ml-1" />
            </v-btn>
          </v-col>
          <v-col v-if="$hasMobileApplication" cols="12">
            <v-textarea label="Описание" v-model="user.description"/>
          </v-col>
        </v-row>
        <v-btn type="button" color="primary" @click="onSubmit">
          Создать <Check :size="18" class="ml-1" />
        </v-btn>
      </v-form>
    </t-card-page>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import useWebcamMixin from '@/utils/mixins/useWebcamMixin';
import {toFormData} from '@/utils/helpers';
import isBossMiddleware from '@/middleware/isBossMiddleware';
import userMixin from '@/mixins/userMixin';
import { Camera, Check, Upload } from 'lucide-vue';

export default {
  components: { Camera, Check, Upload },
  data: () => ({
    generateLoginAutomatically: false,
    generatePasswordAutomatically: false,
    firstname: '',
    lastname: '',
    patronymic: '',
    user: {
      clubs: [],
    },
    validationErrors: {},
    formHasErrors: false,
    errorMessages: '',
    photoPreview: null,
  }),
  mixins: [
    useWebcamMixin, userMixin,
  ],
  middleware: [isBossMiddleware],
  async mounted () {
    await this.initWebcam();
    this.$on('webcam:photo', ({ photoPreview, file }) => {
      this.photoPreview = photoPreview;
      this.user.photo = file;
    });
  },
  beforeDestroy() {
    this.stopWebcam();
  },
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS',
      roles: 'common/ROLES'
    }),
    name () {
      return `${this.lastname} ${this.firstname} ${this.patronymic}`.trim();
    },
    form () {
      return {
        lastname: this.lastname,
        firstname: this.firstname,
        phone: this.user.phone,
        birth_date: this.user.birth_date,
        clubs: this.user.clubs,
        roles: this.user.roles,
      };
    }
  },
  methods: {
    ...mapActions({
      $createUser: 'users/createUser'
    }),
    _onFileInputChange (e) {
      const file = e.target.files[0];
      if (file) {
        this.user.photo = file;
        this.photoPreview = window.URL.createObjectURL(file);
        this.$refs.fileInput.value = null;
      }
    },
    async onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        this.$loader.enable('Идет создание пользователя...');
        await this.$createUser(this._getUserObjectToSubmit());
        this.$router.back();
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    },
    _getUserObjectToSubmit () {
      const user = {...this.user};
      user.name = this.name;
      if (this.generatePasswordAutomatically) {
        delete user.password;
      }
      return toFormData(user);
    },
    _validateForm () {
      let errors = [];
      this.validationErrors = {};
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) errors.push(true);
        this.$refs[f].validate(true);
      })
      return errors.length === 0;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
