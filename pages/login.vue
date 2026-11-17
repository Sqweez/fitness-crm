<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="login-brand">
        <span class="login-brand__mark">
          <Dumbbell :size="18" />
        </span>
        <span class="login-brand__name">Fit CRM</span>
      </div>

      <div class="login-card">
        <h1 class="login-card__title">Вход в систему</h1>
        <p class="login-card__subtitle">Выберите удобный способ входа</p>

        <div class="segmented" role="tablist">
          <button
            type="button"
            role="tab"
            class="segmented__item"
            :class="{ 'segmented__item--active': !isLoginMode }"
            :aria-selected="!isLoginMode"
            @click="mode = 'pass'"
          >
            <CreditCard :size="16" />
            По пропуску
          </button>
          <button
            type="button"
            role="tab"
            class="segmented__item"
            :class="{ 'segmented__item--active': isLoginMode }"
            :aria-selected="isLoginMode"
            @click="mode = 'login'"
          >
            <Lock :size="16" />
            По паролю
          </button>
        </div>

        <div v-if="!isLoginMode" class="pass-mode">
          <form @submit.prevent="doLoginViaPass" class="h-0 w-0 opacity-0 overflow-hidden">
            <input type="password" v-model="pass" ref="passInputRef" autocomplete="off">
          </form>
          <div class="pass-mode__icon" :class="{ 'pass-mode__icon--busy': loading }">
            <Loader2 v-if="loading" :size="28" class="animate-spin" />
            <CreditCard v-else :size="28" />
          </div>
          <p class="pass-mode__title">
            {{ loading ? 'Проверяем карту…' : 'Приложите карту к считывателю' }}
          </p>
          <p class="pass-mode__hint">Вход выполнится автоматически</p>
        </div>

        <form v-else class="login-form" @submit.prevent="doLogin">
          <label class="field">
            <span class="field__label">Телефон</span>
            <span class="field__control">
              <Phone :size="16" class="field__icon" />
              <input
                v-model="login"
                v-mask="'+7 (###) ### ##-##'"
                type="tel"
                inputmode="tel"
                autocomplete="username"
                placeholder="+7 (___) ___ __-__"
                class="field__input"
              >
            </span>
          </label>
          <label class="field">
            <span class="field__label">Пароль</span>
            <span class="field__control">
              <Lock :size="16" class="field__icon" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Введите пароль"
                class="field__input"
              >
              <button
                type="button"
                class="field__toggle"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </span>
          </label>
          <button type="submit" class="login-submit" :disabled="loading">
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            Войти
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { CreditCard, Dumbbell, Eye, EyeOff, Loader2, Lock, Phone } from 'lucide-vue';

export default {
  guest: true,
  layout: 'empty',
  components: { CreditCard, Dumbbell, Eye, EyeOff, Loader2, Lock, Phone },
  data: () => ({
    login: '',
    password: '',
    pass: '',
    loading: false,
    interval: null,
    mode: 'pass',
    showPassword: false,
  }),
  computed: {
    isLoginMode () {
      return this.mode === 'login';
    },
  },
  mounted () {
    if (this.$vuetify.breakpoint.smAndDown) {
      this.mode = 'login';
    }
    this.interval = setInterval(() => {
      // Keep the hidden input focused so the card reader can type into it
      const input = this.$refs.passInputRef;
      if (!this.isLoginMode && input) {
        input.focus();
      }
    }, 1000)
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    async doLogin () {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        await this.$auth.login({
          data: {
            login: this.login,
            password: this.password,
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async doLoginViaPass () {
      if (this.loading) {
        return;
      }
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
      }
    }
  },
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--surface-page);
  font-family: var(--font-ui);
  color: var(--text);
}

.login-panel {
  width: 100%;
  max-width: 400px;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
  }

  &__name {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
}

.login-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 28px 24px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.08);

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    text-align: center;
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 14px;
    color: var(--text-muted);
    text-align: center;
  }
}

.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-top: 20px;
  padding: 4px;
  border-radius: 8px;
  background: var(--surface-sunken);
  border: 1px solid var(--line-soft);

  &__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    border-radius: var(--radius-control);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      color: var(--text);
    }

    &:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 1px;
    }

    &--active {
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px var(--line);
    }
  }
}

.pass-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // Match the password form height so the card doesn't jump between tabs
  min-height: 208px;
  margin-top: 20px;
  text-align: center;

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: color-mix(in oklch, var(--accent) 12%, transparent);
    color: var(--accent-hover);
    animation: pass-pulse 2s ease-in-out infinite;

    &--busy {
      animation: none;
    }
  }

  &__title {
    margin-top: 16px;
    font-size: 15px;
    font-weight: 500;
  }

  &__hint {
    margin-top: 4px;
    font-size: 13px;
    color: var(--text-muted);
  }
}

@keyframes pass-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--accent) 30%, transparent); }
  50% { box-shadow: 0 0 0 10px color-mix(in oklch, var(--accent) 0%, transparent); }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 13px;
    font-weight: 500;
  }

  &__control {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__icon {
    position: absolute;
    left: 12px;
    color: var(--text-faint);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 36px;
    border: 1px solid var(--line);
    border-radius: var(--radius-control);
    background: var(--surface);
    font-size: 16px; // 16px prevents iOS zoom on focus
    color: var(--text);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder {
      color: var(--text-faint);
    }

    &:focus {
      outline: none;
      border-color: var(--focus-ring);
      box-shadow: 0 0 0 3px color-mix(in oklch, var(--focus-ring) 15%, transparent);
    }
  }

  &__toggle {
    position: absolute;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-control);
    color: var(--text-faint);

    &:hover {
      color: var(--text);
      background: var(--surface-sunken);
    }
  }
}

.login-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  margin-top: 4px;
  border-radius: var(--radius-control);
  background: var(--accent-hover);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.15s ease, opacity 0.15s ease;

  &:hover {
    background: oklch(55% 0.15 149);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}
</style>
