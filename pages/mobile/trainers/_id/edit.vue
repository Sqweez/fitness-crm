<template>
  <t-card-page title="Редактирование тренера">
    <v-progress-linear v-if="loading" indeterminate color="primary" aria-label="Загрузка тренера" />
    <v-alert v-else-if="loadFailed" type="error" text>
      Не удалось загрузить тренера.
      <v-btn text small @click="loadTrainer">Повторить</v-btn>
      <v-btn text small to="/mobile/trainers">К списку</v-btn>
    </v-alert>
    <trainer-form v-else :trainer="trainer" @saved="$router.push('/mobile/trainers')" />
  </t-card-page>
</template>

<script>
import manageTrainersMiddleware from '@/middleware/manageTrainersMiddleware';

export default {
  middleware: [manageTrainersMiddleware],
  data: () => ({
    trainer: null,
    loading: true,
    loadFailed: false,
  }),
  mounted () {
    this.loadTrainer();
  },
  methods: {
    async loadTrainer () {
      this.loading = true;
      this.loadFailed = false;
      try {
        this.trainer = await this.$store.dispatch('trainers/getTrainer', this.$route.params.id);
      } catch (error) {
        this.loadFailed = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
