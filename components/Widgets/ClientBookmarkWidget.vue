<template>
  <div>
    <t-card-page title="Закладка клиентов" color="#26c6da" dark>
      <v-responsive height="300" v-if="loading" class="flex justify-center items-center w-full text-center">
        <v-progress-circular
          size="48"
          indeterminate
          color="white"
        />
      </v-responsive>
      <v-data-table
        :items-per-page="-1"
        v-if="!loading"
        light
        :items="filteredClients"
        :headers="headers"
        no-data-text="В ваших закладках отсутствуют клиенты"
        @click:row="$router.push(`/clients/${$event.id}`)"
      >
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
        <template v-slot:item.avatar="{ item }">
          <div class="flex justify-center">
            <v-img
              cover
              :aspect-ratio="1"
              :max-height="100"
              :max-width="100"
              :src="item.photo ? item.photo : avatar"
            />
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            color="error"
            @click.stop="removeClient(item, $event)"
          >
            <X :size="18" />
          </v-btn>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import UserAvatar from "assets/images/logo.jpg";
import { X } from 'lucide-vue';

export default {
  components: { X },
  data: () => ({
    avatar: UserAvatar,
    loading: true,
    headers: [
      {
        value: 'ordinal',
        text: '#'
      },
      {
        value: 'avatar',
        text: 'Фото'
      },
      {
        value: 'name',
        text: 'ФИО'
      },
      {
        value: 'phone',
        text: 'Телефон'
      },
      {
        value: 'actions',
        text: 'Действие'
      }
    ]
  }),
  computed: {
    filteredClients () {
      return this.$store.getters['bookmark/bookmarks'];
    }
  },
  async beforeMount() {
    this.loading = true;
    await this.$store.dispatch('bookmark/getBookmarks');
    this.loading = false;
  },
  methods: {
    ...mapActions({
      $removeBookmark: 'bookmark/removeFromBookmark',
    }),
    async removeClient (client) {
      this.$loader.enable();
      await this.$removeBookmark(client.id);
      this.$loader.disable();
    }
  }
}
</script>

<style scoped lang="scss">

</style>
