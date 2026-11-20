<template>
  <div class="flex h-screen overflow-hidden" >
    <!-- utils components -->
    <util-container />
    <!-- Sidebar -->
    <sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    <select-club-modal :state="showSelectClubModal" @close="showSelectClubModal = false;"/>
    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden" id="app-container" style="background-color: var(--surface-page)">

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
import Sidebar from '~/components/Navigation/Sidebar.vue';
import { ArrowDown, ArrowUp } from 'lucide-vue';
import ScrollButtons from '~/components/Layout/ScrollButtons.vue';
import { canManageChats } from '@/utils/chats';

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
    // Not reactive: only needed to undo the subscription in beforeDestroy
    this.chatsConnected = canManageChats(this.$auth.user);
    if (this.chatsConnected) {
      this.$store.dispatch('chats/connect');
    }
    this.$root.$on('change:club', () => {
      this.showSelectClubModal = true;
    })
  },
  // Unread chats counter in the browser tab title, visible from other tabs
  head () {
    const unread = this.$store.state.chats.unread.chats;
    return { titleTemplate: unread ? `(${unread}) %s` : '%s' };
  },
  // Logout switches to the empty layout: drop chat channels so the next user does not inherit them
  beforeDestroy () {
    // $auth.user is already cleared on logout, so rely on the flag set at creation
    if (this.chatsConnected) {
      this.$store.dispatch('chats/disconnect');
    }
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
