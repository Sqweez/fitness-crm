<template>
  <t-card-page title="Настройки мобильного приложения">
    <v-progress-linear v-if="loading" indeterminate color="primary" aria-label="Загрузка настроек" />
    <v-alert v-else-if="loadError" type="error" text>
      {{ loadError }}
      <v-btn text small @click="loadConfig">Повторить</v-btn>
    </v-alert>
    <mobile-config-form v-else :initial-config="config" />
  </t-card-page>
</template>

<script>
import manageTrainersMiddleware from '@/middleware/manageTrainersMiddleware';

export default {
  middleware: [manageTrainersMiddleware],
  data: () => ({
    config: null,
    loading: true,
    loadError: null,
  }),
  mounted () {
    this.loadConfig();
  },
  methods: {
    async loadConfig () {
      this.loading = true;
      this.loadError = null;
      try {
        this.config = await this.$store.dispatch('mobileConfig/getConfig');
      } catch ({ response }) {
        this.loadError = response?.status === 403
          ? 'Нет доступа к настройкам приложения.'
          : 'Не удалось загрузить настройки приложения.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
