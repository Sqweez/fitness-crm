<template>
  <div>
    <t-card-page title="Запросы на штрафные тренировки">
      <v-data-table
        :items-per-page="-1"
        :items="penalties"
        :headers="headers"
        no-data-text="Все одобрено! Отличная работа 👍"
      >
        <template v-slot:item.client="{item}">
          <div class="flex items-center">
            <span>{{ item.client.name }}</span>
            <v-btn :to="`/clients/${item.client.id}`" icon target="_blank">
              <Eye :size="18" />
            </v-btn>
          </div>
        </template>
        <template v-slot:item.actions="{item}">
          <v-btn icon color="error" title="Отклонить" @click="onDecline(item.id)">
            <X :size="18" />
          </v-btn>
          <v-btn icon color="success" title="Подтвердить" @click="onAccept(item.id)">
            <Check :size="18" />
          </v-btn>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import isBossMiddleware from '@/middleware/isBossMiddleware';
import { Check, Eye, X } from 'lucide-vue';

export default {
  middleware: [isBossMiddleware],
  components: { Check, Eye, X },
  data: () => ({
    penalties: [],
    headers: [
      {
        text: 'Клиент',
        value: 'client'
      },
      {
        text: 'Услуга',
        value: 'service'
      },
      {
        text: 'Инициатор',
        value: 'user.name'
      },
      {
        text: 'Клуб',
        value: 'club.name'
      },
      {
        text: 'Дата списания тренировки',
        value: 'penalty_date'
      },
      {
        text: 'Дата создания',
        value: 'created_at'
      },
      {
        text: 'Причина',
        value: 'description'
      },
      {
        text: 'Действие',
        value: 'actions'
      }
    ],
  }),
  computed: {},
  methods: {
    async getPenalties () {
      this.$loader.enable('Пожалуйста, подождите...');
      const { data: { data } } = await this.$axios.get(`/v1/requests/penalties`);
      this.penalties = data;
      this.$loader.disable();
    },
    async onDecline (id) {
      await this.$confirm(
        `Вы действительно хотите отклонить данное списание?`
      ).then(async () => {
        await this.$axios.patch(`/v1/penalty/${id}`, { is_declined: true });
        this.penalties = this.penalties.filter(p => p.id !== id);
      })
    },
    async onAccept (id) {
      await this.$confirm(
        `Вы действительно хотите подтвердить данное списание?`
      ).then(async () => {
        await this.$axios.patch(`/v1/penalty/${id}`, { is_accepted: true });
        this.penalties = this.penalties.filter(p => p.id !== id);
      })
    },
  },
  async mounted () {
    await this.getPenalties();
  },
}
</script>

<style scoped lang="scss">

</style>
