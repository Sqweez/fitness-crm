<template>
  <div class="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <t-card-page title="Добавление сотрудника">
      <v-form ref="form" class="w-full mx-auto">
        <div class="space-y-6">
          <div class="rounded-2xl bg-white/80 shadow-sm p-3">
            <div class="mb-4">
              <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Основные данные</div>
              <div class="text-base font-semibold text-slate-800">Профиль сотрудника</div>
            </div>
            <v-row class="px-1">
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
                  maxlength="18"
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
                  maxlength="10"
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
              <v-col v-if="$hasMobileApplication" cols="12">
                <v-textarea label="Описание" v-model="user.description"/>
              </v-col>
            </v-row>
          </div>

          <div class="rounded-2xl bg-white/80 shadow-sm p-3">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Фото</div>
                <div class="text-base font-semibold text-slate-800">Портрет сотрудника</div>
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
                Фото используется в профиле сотрудника и помогает быстрее находить его в списках.
              </div>
              <canvas ref="canvas" width="384" height="384" v-show="false"></canvas>
            </div>
            <div class="mt-4 flex flex-wrap gap-3">
              <input type="file" accept="image/*" ref="fileInput" @change="_onFileInputChange" class="hidden">
              <v-btn color="primary" @click="$refs.fileInput.click()">
                Загрузить фото <Upload :size="18" class="ml-1" />
              </v-btn>
              <v-btn color="primary" @click="_capturePhoto" v-show="isClientVideoEnabled">
                Сфотографировать <Camera :size="18" class="ml-1" />
              </v-btn>
            </div>
          </div>

          <div class="flex items-center justify-between bg-white/80 shadow-sm px-3 py-2.5">
            <div class="text-sm text-slate-600">
              Проверьте данные перед созданием.
            </div>
            <v-btn type="button" color="primary" @click="onSubmit">
              Создать <Check :size="18" class="ml-1" />
            </v-btn>
          </div>
        </div>
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
