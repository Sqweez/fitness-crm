<template>
  <div class="flex h-screen overflow-hidden" >
    <!-- utils components -->
    <util-container />
    <!-- Sidebar -->
    <sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />
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
        <scroll-buttons />
      </main>
    </div>
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';
import Sidebar from '~/components/Navigation/SidebarV2.vue';
import { ArrowDown, ArrowUp } from 'lucide-vue';
import ScrollButtons from '~/components/Layout/ScrollButtons.vue';

export default {
  name: 'Dashboard',
  components: { ScrollButtons, ArrowDown, ArrowUp, Sidebar },
  mixins: [
    userMixin
  ],
  data: () => ({
    sidebarOpen: false,
    showSelectClubModal: false,
    keepAlivePages: [
      'ClientsPage',
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
