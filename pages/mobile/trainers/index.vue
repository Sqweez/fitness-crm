<template>
  <div>
    <t-card-page title="Тренеры">
      <v-btn color="primary" :disabled="loading || !!deletingId" to="/mobile/trainers/create">
        Добавить тренера <Plus :size="18" class="ml-1" />
      </v-btn>
      <v-alert v-if="loadFailed" type="error" text class="mt-4">
        Не удалось загрузить тренеров.
        <v-btn text small @click="loadTrainers">Повторить</v-btn>
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="trainers"
        :loading="loading"
        :items-per-page="10"
        disable-sort
        loading-text="Загрузка тренеров…"
        no-data-text="Тренеров пока нет. Добавьте первого тренера."
        class="mt-4"
      >
        <template v-slot:item.photo_url="{ item }">
          <v-avatar size="48" rounded class="my-2" color="grey lighten-4">
            <img v-if="item.photo_url" :src="item.photo_url" :alt="`${item.first_name} ${item.last_name}`" class="object-cover" />
            <User v-else :size="24" class="text-slate-400" />
          </v-avatar>
        </template>
        <template v-slot:item.is_active="{ item }">
          <v-chip small :color="item.is_active ? 'success' : 'grey'" outlined>
            {{ item.is_active ? 'Виден' : 'Скрыт' }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="flex">
            <v-btn
              icon
              :aria-label="`Редактировать: ${item.first_name} ${item.last_name}`"
              :disabled="!!deletingId"
              class="text-green-500 hover:bg-green-50"
              :to="`/mobile/trainers/${item.id}/edit`"
            ><Pencil :size="18" /></v-btn>
            <v-btn
              icon
              :aria-label="`Удалить: ${item.first_name} ${item.last_name}`"
              :loading="deletingId === item.id"
              :disabled="!!deletingId"
              class="text-red-500 hover:bg-red-50"
              @click="deleteTrainer(item)"
            ><Trash2 :size="18" /></v-btn>
          </div>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Plus, Pencil, Trash2, User } from 'lucide-vue';
import manageTrainersMiddleware from '@/middleware/manageTrainersMiddleware';

export default {
  name: 'TrainersIndexPage',
  components: { Plus, Pencil, Trash2, User },
  middleware: [manageTrainersMiddleware],
  data: () => ({
    loading: true,
    loadFailed: false,
    deletingId: null,
    headers: [
      { text: 'Фото', value: 'photo_url' },
      { text: 'Имя', value: 'first_name' },
      { text: 'Фамилия', value: 'last_name' },
      { text: 'Специализация', value: 'specialization' },
      { text: 'Порядок', value: 'sort_order' },
      { text: 'В приложении', value: 'is_active' },
      { text: 'Действия', value: 'actions' },
    ],
  }),
  computed: {
    ...mapGetters({ trainers: 'trainers/TRAINERS' }),
  },
  mounted () {
    this.loadTrainers();
  },
  methods: {
    async loadTrainers () {
      this.loading = true;
      this.loadFailed = false;
      try {
        await this.$store.dispatch('trainers/getTrainers');
      } catch (error) {
        this.loadFailed = true;
      } finally {
        this.loading = false;
      }
    },
    async deleteTrainer (trainer) {
      this.deletingId = trainer.id;
      try {
        const confirmed = await this.$confirm(
          `Удалить тренера «${trainer.first_name} ${trainer.last_name}» и его фотографию?`
        ).catch(cancelled => {
          if (cancelled !== false) throw cancelled;
          return false;
        });
        if (!confirmed) return;
        await this.$store.dispatch('trainers/deleteTrainer', trainer.id);
        this.$toast.success('Тренер удалён');
      } finally {
        this.deletingId = null;
      }
    },
  },
};
</script>
