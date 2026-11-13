<template>
  <t-card-page title="О клубе">
    <v-select
      v-if="$user.clubs.length > 1"
      v-model="clubId"
      :items="$user.clubs"
      item-text="name"
      item-value="id"
      label="Клуб"
      :disabled="loading"
      @change="loadClub"
    />
    <v-progress-linear v-if="loading" indeterminate color="primary" aria-label="Загрузка информации о клубе" />
    <v-alert v-else-if="loadError" type="error" text>
      {{ loadError }}
      <v-btn text small @click="loadClub">Повторить</v-btn>
    </v-alert>
    <club-profile-form v-else :key="club.id" :initial-club="club" />
  </t-card-page>
</template>

<script>
import userMixin from '@/mixins/userMixin';
import manageTrainersMiddleware from '@/middleware/manageTrainersMiddleware';

const LOAD_ERRORS = {
  403: 'Нет доступа к этому клубу.',
  404: 'Клуб не найден.',
};

export default {
  middleware: [manageTrainersMiddleware],
  mixins: [userMixin],
  data () {
    return {
      clubId: this.$store.getters['user/$currentClub'],
      club: null,
      loading: true,
      loadError: null,
    };
  },
  mounted () {
    this.loadClub();
  },
  methods: {
    async loadClub () {
      this.loading = true;
      this.loadError = null;
      try {
        this.club = await this.$store.dispatch('clubProfiles/getClubProfile', this.clubId);
      } catch ({ response }) {
        this.loadError = LOAD_ERRORS[response?.status] || 'Не удалось загрузить информацию о клубе.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
