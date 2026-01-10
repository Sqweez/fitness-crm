<template>
  <div>
    <t-card-page title="Запросы на восстановление услуг">
      <v-data-table
        :items-per-page="-1"
        :items="restored"
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
        <template v-slot:item.restore_price="{item}">
          {{ item.restore_price | priceFilters }}
        </template>
        <template v-slot:item.document="{item}">
          <v-list v-if="item.document">
            <t-list-item title="Загруженный документ">
              {{ item.document.name }}
              <template #action>
                <v-btn icon color="success" @click="$file.download(item.document.link)">
                  <Download :size="18" />
                </v-btn>
              </template>
            </t-list-item>
          </v-list>
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
import { Check, Download, Eye, X } from 'lucide-vue';

export default {
  middleware: [isBossMiddleware],
  components: { Check, Download, Eye, X },
  data: () => ({
    headers: [
      {
        text: 'Клиент',
        value: 'client'
      },
      {
        text: 'Услуга',
        value: 'service.name'
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
        text: 'Стоимость',
        value: 'restore_price'
      },
      {
        text: 'Продлить до',
        value: 'restore_until'
      },
      {
        text: 'Дата создания',
        value: 'created_at'
      },
      {
        text: 'Документ',
        value: 'document'
      },
      {
        text: 'Действие',
        value: 'actions'
      }
    ],
    restored: [],
  }),
  computed: {},
  async mounted () {
    await this.getRestored();
  },
  methods: {
    async getRestored () {
      this.$loader.enable('Пожалуйста, подождите...');
      const { data: { data } } = await this.$axios.get(`/v1/requests/restored`);
      this.restored = data;
      this.$loader.disable();
    },
    async onDecline (id) {
      await this.$confirm(
        `Вы действительно хотите отклонить данное восстановление?`
      ).then(async () => {
        await this.$axios.patch(`/v1/restored/${id}`, { is_declined: true });
        this.restored = this.restored.filter(p => p.id !== id);
      })
    },
    async onAccept (id) {
      await this.$confirm(
        `Вы действительно хотите подтвердить данное восстановление?`
      ).then(async () => {
        await this.$axios.patch(`/v1/restored/${id}`, { is_accepted: true });
        this.restored = this.restored.filter(p => p.id !== id);
      })
    }}
}

</script>

<style scoped lang="scss">

</style>
