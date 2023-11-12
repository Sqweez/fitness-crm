<template>
  <div class="flex h-screen overflow-hidden" >
    <!-- utils components -->
    <util-container />
    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    <select-club-modal :state="showSelectClubModal" @close="showSelectClubModal = false;"/>
    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden" id="app-container">

      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main>
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <v-app>
            <Nuxt
              v-show="!showSelectClubModal"
              keep-alive
              :keep-alive-props="{ include: keepAlivePages}"
            />
          </v-app>
        </div>
        <div class="fixed bottom-24 right-6 z-50 hidden md:flex flex-col">
          <v-btn fab outlined color="blue darken-4" small @click="scrollToTop">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn fab outlined color="blue darken-4" small @click="scrollToBottom">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';

export default {
  name: 'Dashboard',
  mixins: [
    userMixin
  ],
  data: () => ({
    sidebarOpen: false,
    showSelectClubModal: false,
    keepAlivePages: [
      'products-index-page',
      'ClientsPage',
      'ServiceIndexPage',
      'UsersIndexPage',
      'SleepingClientsIndexPage'
    ],
  }),
  methods: {
    scrollToTop () {
      document.querySelector('#app-container').scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    scrollToBottom () {
      document.querySelector('#app-container').scrollTo({
        top: 20000,
        behavior: "smooth"
      });
    },
  },
  created () {
    this.$store.dispatch('INIT');
    this.$root.$on('change:club', () => {
      this.showSelectClubModal = true;
    })
  },
  watch: {
    $route(to, from) {
      this.sidebarOpen = false;
      this.scrollToTop();
    },
    $user: {
      immediate: true,
      handler: function (value) {
        if (value && value.must_select_club) {
          this.showSelectClubModal = true;
        }
      }
    }
  },
}
</script>
