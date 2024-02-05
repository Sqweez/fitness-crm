<template>
  <div v-if="USER_LOADED">
    <confirmation-modal :state="showDeleteModal" @close="showDeleteModal = false" />
    <v-row>
      <v-col cols="3">
        <t-card-page :title="user.name">
          <div class="p-4 flex flex-col items-center gap-y-2">
            <div class="w-40 h-40 overflow-hidden">
              <img :src="user.photo ? user.photo : avatar" :alt="user.name" class="w-full h-full object-cover object-top">
            </div>
            <v-list>
              <t-list-item title="Имя">
                {{ user.name }}
              </t-list-item>
              <t-list-item title="Должность">
                {{ user.position }}
              </t-list-item>
              <t-list-item title="Клуб">
                <p v-for="club of user.club" :key="club.id">
                  {{ club.name }}
                </p>
              </t-list-item>
            </v-list>
          </div>
        </t-card-page>
        <t-card-page title="Быстрые действия" class="mt-4">
          <h3>Быстрые действия с пользователем:</h3>
          <v-btn block color="primary" @click="$refs.fileInput.click()">
            Загрузить фото <v-icon>mdi-camera</v-icon>
          </v-btn>
          <input type="file" accept="image/*" ref="fileInput" class="hidden" @change="_onPhotoChange">
          <v-switch label="Виден в приложении" v-model="visibleInApp"/>
          <v-btn  v-if="user.is_active" block color="error" @click="_onDelete">
            Уволить <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn  v-if="!user.is_active" block color="error" @click="_onRestore">
            Восстановить <v-icon>mdi-check</v-icon>
          </v-btn>
        </t-card-page>
      </v-col>
      <v-col cols="9">
        <t-card-page title="Редактор профиля">
          <v-form ref="form">
            <v-text-field
              ref="name"
              label="Полное имя"
              v-model="_user.name"
              :rules="[() => !!_user.name || 'Поле имя обязательно для заполнения']"
              required
              :error="!!validationErrors.name"
              :error-messages="validationErrors.name"
            />
            <v-text-field
              ref="phone"
              v-model="_user.phone"
              label="Телефон"
              v-mask="'+7 (###) ### ##-##'"
              :rules="[
                () => !!_user.phone || 'Поле телефон обязательно для заполнения',
                () => !!_user.phone && _user.phone.length === 18 || 'Телефон должен быть заполнен полностью'
              ]"
              required
              :error="!!validationErrors.phone"
              :error-messages="validationErrors.phone"
            />
            <v-text-field
              ref="birth_date"
              label="Дата рождения"
              v-model="_user.birth_date"
              v-mask="'##.##.####'"
              hint="День.месяц.год"
              :rules="[
                () => !!_user.birth_date || 'Поле дата рождения обязательно для заполнения',
                () => !!_user.birth_date && _user.birth_date.length === 10 || 'Дата рождения заполнена некорректно'
              ]"
              required
              :error="!!validationErrors.birth_date"
              :error-messages="validationErrors.birth_date"
            />
            <v-select
              ref="club"
              label="Клуб"
              :items="clubs"
              item-text="name"
              multiple
              item-value="id"
              v-model="_user.clubs_id"
              placeholder="Клуб"
              persistent-placeholder
              required
              :error="!!validationErrors.roles"
              :error-messages="validationErrors.roles"
            />
            <v-select
              ref="roles"
              label="Должность"
              :items="roles"
              item-text="name"
              item-value="id"
              v-model="_user.roles"
              multiple
              placeholder="Должность"
              persistent-placeholder
              :rules="[
                () => !!_user.roles && _user.roles.length > 0 || 'Выберите хотя бы одну должность!'
              ]"
              required
              :error="!!validationErrors.roles"
              :error-messages="validationErrors.roles"
            />
            <v-text-field
              label="Карта"
              v-model="_user.pass"
              :error="!!validationErrors.pass"
              :error-messages="validationErrors.pass"
            />
            <v-textarea label="Описание" v-model="_user.description"/>
            <v-text-field
              label="Пароль"
              v-if="changePassword"
              v-model="password"
            />
            <v-switch label="Сменить пароль?" v-model="changePassword" />
            <v-btn block color="primary" type="button" @click="_onSubmit">
              Сохранить <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-form>
        </t-card-page>
      </v-col>
      <v-col cols="12">
        <lazy-user-reports :user-id="$route.params.id" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import UserAvatar from '@/assets/images/logo.jpg'
import {deepClone} from "@/utils/helpers";
import isBossMiddleware from '@/middleware/isBossMiddleware';

export default {
  data: () => ({
    avatar: UserAvatar,
    visibleInApp: false,
    showDeleteModal: false,
    validationErrors: {},
    changePassword: false,
    password: '',
  }),
  async mounted() {
    try {
      this.$loader.enable('Пожалуйста, подождите...');
      await this.$getUser(this.$route.params.id);
    } catch (e) {
      this.$toast.error('Пользователь не найден!')
      this.$router.push('/');
    } finally {
      this.$loader.disable();
    }
  },
  computed: {
    ...mapGetters({
      roles: 'common/ROLES',
      clubs: 'common/CLUBS'
    }),
    USER_LOADED() {
      return !!this.$store.getters["users/USER"] && this.user.id == this.$route.params.id;
    },
    user() {
      return this.$store.getters["users/USER"];
    },
    _user () {
      return {...deepClone(this.user), club_id: this.user.club.id};
    },
    form () {
      return {
        name: this._user.name,
        phone: this._user.phone,
        birth_date: this._user.birth_date,
        roles: this._user.roles,
      }
    }
  },
  middleware: [isBossMiddleware],
  methods: {
    ...mapActions({
      '$getUser': "users/getUser",
      '$deleteUser': "users/deleteUser",
      '$updateUser': "users/updateUser",
      '$uploadPhoto': "users/uploadPhoto",
      '$restoreUser': 'users/restoreUser'
    }),
    _onDelete () {
      this.$confirm('Вы действительно хотите удалить выбранного сотрудника')
        .then(_ => {
          this.$loader.enable('Пожалуйста, подождите');
          this.$deleteUser(this.user.id);
          this.$loader.disable();
          this.$router.back();
        })
    },
    _onRestore () {
      this.$confirm('Вы действительно хотите восстановить выбранного сотрудника')
        .then(_ => {
          this.$loader.enable('Пожалуйста, подождите');
          this.$restoreUser(this.user.id);
          this.$loader.disable();
          this.$router.back();
        })
    },
    async _onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        const payload = {...this._user};
        if (this.changePassword && this.password) {
          payload.password = this.password;
        }
        delete payload.photo;
        this.$loader.enable('Идет обновление пользователя...');
        await this.$updateUser(payload);
        this.$router.back();
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    },
    async _onPhotoChange (e) {
      const photo = e.target.files[0];
      const formData = new FormData();
      formData.append('photo', photo);
      await this.$uploadPhoto({id: this.user.id, file: formData});
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
