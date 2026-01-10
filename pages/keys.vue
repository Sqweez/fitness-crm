<template>
  <div>
    <t-card-page title="Выданные ключи">
      <v-text-field
        v-model="search"
        label="Поиск"
        single-line
        hide-details
      >
        <template v-slot:append>
          <Search :size="20" class="text-gray-400" />
        </template>
      </v-text-field>
      <v-data-table
        :items-per-page="-1"
        :headers="headers"
        :items="keys"
        :search="search"
        @click:row="$router.push(`/clients/${$event.active_session.client_id}`)"
      >
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {__hardcoded} from '@/utils/helpers';
import { Search } from 'lucide-vue';

export default {
  components: { Search },
  data: () => ({
    search: '',
    keys: [],
    headers: [
      {
        value: 'active_session.client.name',
        text: 'Клиент'
      },
      {
        value: 'active_session.start_user.name',
        text: 'Кто выдал'
      },
      {
        value: 'cabinet_number',
        text: 'Номер шкафчика'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'date',
        text: 'Дата выдачи'
      }
    ],
  }),
  async mounted() {
    this.$loader.enable();
    const { data  } = await this.$axios.get(`/v1/economy/my/keys`);
    this.keys = data;
    this.$loader.disable();
  },
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
