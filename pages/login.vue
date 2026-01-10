<template>
  <div>
    <div class="fixed inset-0 bg-black bg-opacity-20">
      <img :src="randomBackgroundURL" alt="" class="w-full h-full object-cover blur-md">
    </div>
    <div class="login-container">
      <v-card class="login">
        <v-toolbar
          flat
          primary
          color="primary"
          dark
        >
          <v-toolbar-title>Вход</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="p-4" v-if="!hasLoginQuery">
            <form @submit.prevent="doLoginViaPass" class="h-0 w-0 opacity-0">
              <input type="password" v-model="pass"  ref="passInputRef" >
            </form>
            <h4 class="text-center font-medium">
              Приложите карту для входа
            </h4>
          </div>
          <v-form v-else>
            <v-text-field
              v-mask="'+7 (###) ### ##-##'"
              label="Логин"
              v-model="login"
              type="text">
              <template v-slot:prepend>
                <User :size="18" class="text-gray-400" />
              </template>
            </v-text-field>
            <v-text-field
              @keypress.enter="doLogin"
              label="Пароль"
              v-model="password"
              type="password"
            >
              <template v-slot:prepend>
                <Lock :size="18" class="text-gray-400" />
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-center" v-if="hasLoginQuery">
          <v-btn v-if="!loading" color="primary" block @click="doLogin">Войти</v-btn>
          <v-progress-circular indeterminate size="40" color="primary" v-else></v-progress-circular>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';
import { Lock, User } from 'lucide-vue';

export default {
  guest: true,
  layout: 'empty',
  components: { Lock, User },
  data: () => ({
    login: '',
    password: '',
    pass: '',
    loading: false,
    interval: null,
  }),
  computed: {
    hasLoginQuery () {
      return !!this.$route.query.login;
    },
    hasFastLoginQuery () {
      return !!this.$route.query?.fast_secret_login;
    },
    randomBackgroundURL () {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return `https://source.unsplash.com/random/${width}x${height}?fitness,sport,motivation`
    }
  },
  mounted () {
    this.pass = __hardcoded('3834025514');
    this.doLoginViaPass();
    return ;
    if (this.hasFastLoginQuery) {
      // @TODO 2023-04-18T17:32:19 remove it later
      this.pass = __hardcoded('3834025514');
      this.doLoginViaPass();
    }
    if (!this.hasLoginQuery) {
      this.interval = setInterval(() => {
        const input = this.$refs.passInputRef;
        if (input) {
          input.focus();
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    async doLogin () {
      try {
        this.$loader.enable();
        await this.$auth.login({
          data: {
            login: this.login,
            password: this.password,
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.$loader.disable();
      }
    },
    async doLoginViaPass () {
      if (this.loading) {
        return;
      }
      this.$loader.enable();
      this.loading = true;
      const pass = this.pass;
      this.pass = '';
      try {
        await this.$auth.login({
          data: {
            pass: pass
          },
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.$loader.disable();
      }
    }
  },
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  width: 500px;
}
</style>
