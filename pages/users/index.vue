<template>
  <div>
    <t-card-page title="Сотрудники">
      <v-btn
        @click="$router.push('/users/create')"
        color="primary"
        dark
      >
        Добавить сотрудника
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-expansion-panels class="mt-4 mb-2">
        <v-expansion-panel>
          <v-expansion-panel-header color="blue darken-1">
            <h5 class="text-white"><b>Фильтры:</b></h5>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              :items="clubs"
              v-model="clubId"
              item-value="id"
              item-text="name"
              label="Клуб"
            />
            <v-select
              :items="roles"
              v-model="roleId"
              item-value="id"
              item-text="name"
              label="Должность"
            />
            <v-checkbox
              label="Показать уволенных сотрудников"
              v-model="withInactive"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
        ref="searchInput"
      ></v-text-field>
      <v-data-table
        :items-per-page="-1"
        :headers="headers"
        :items="filteredUsers"
        :search="search"
        @click:row="_onRowClick"
        :item-class="itemRowBackground"
      >
        <template v-slot:item.ordinal="{item, index}">
          {{ index + 1 }}
        </template>
        <template v-slot:item.club="{ item }">
          {{ item.club.map(c => c.name).join(',') }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon>
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import isBossMiddleware from '@/middleware/isBossMiddleware';

export default {
  name: 'UsersIndexPage',
  middleware: [isBossMiddleware],
  data: () => ({
    headers: [
      {
        value: 'ordinal',
        text: '#',
      },
      {
        value: 'id',
        align: ' hidden'
      },
      {
        text: 'Имя',
        value: 'name'
      },
      {
        text: 'Клуб',
        value: 'club'
      },
      {
        text: 'Должность',
        value: 'position'
      },
     /* {
        text: 'Действие',
        value: 'actions'
      }*/
    ],
    search: '',
    clubId: -1,
    roleId: -1,
    withInactive: false,
  }),
  computed: {
    ...mapGetters({
      users: 'users/USERS',
      roles: 'common/ROLES_FILTERS',
      clubs: 'common/CLUBS_FILTERS',
    }),
    filteredUsers () {
      return this.users
        .filter(user => {
          if (this.clubId === -1) {
            return true;
          }
          return user.club.id === this.clubId;
        })
        .filter(user => {
          if (this.roleId === -1) {
            return true;
          }
          return !!user.roles.find(r => r.id === this.roleId);
        })
    }
  },
  methods: {
    ...mapActions({
      '$getUsers': 'users/getUsers',
    }),
    _onRowClick (e) {
      this.$router.push(`/users/${e.id}`)
    },
    async _getUsers () {
      this.$loader.enable();
      let query = {};
      if (this.withInactive) {
        query['with-inactive'] = 1;
      }
      await this.$getUsers(query);
      this.$refs.searchInput.focus();
      this.$loader.disable();
    },
    itemRowBackground (item) {
      return item.is_active ? 'cursor-pointer' : 'bg-inactive cursor-pointer';
    }
  },
  watch: {
    withInactive: {
      immediate: true,
      handler: async function (value) {
        await this._getUsers();
      }
    }
  }
}
</script>

<style lang="scss">
.bg-inactive {
  background-color: #d5d5d5 !important;
}
</style>
