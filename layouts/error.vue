<template>
  <div class="error-page">
    <h1 class="error-page__title">{{ title }}</h1>
    <p class="error-page__text">{{ description }}</p>
    <div class="error-page__actions">
      <v-btn color="primary" @click="reload">Обновить страницу</v-btn>
      <v-btn outlined @click="$router.push('/')">На главную</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  computed: {
    title () {
      return this.error.statusCode === 404 ? 'Страница не найдена' : 'Не удалось загрузить страницу';
    },
    description () {
      return this.error.statusCode === 404
        ? 'Проверьте адрес или вернитесь на главную.'
        : 'Скорее всего, пропало соединение или вышло обновление приложения. Обновите страницу.';
    }
  },
  methods: {
    reload () {
      window.location.reload();
    }
  }
}
</script>

<style scoped>
.error-page {
  max-width: 560px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-page);
}

.error-page__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}

.error-page__text {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-muted);
}

.error-page__actions {
  display: flex;
  gap: 8px;
}
</style>
