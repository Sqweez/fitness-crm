<template>
  <header class="sticky top-0 border-b border-gray-200 z-30" :style="{backgroundColor: 'rgb(249, 249, 249)'}">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 -mb-px">

        <!-- Header: Left side -->
        <div class="flex">

          <!-- Hamburger button -->
          <button class="text-gray-500 hover:text-gray-600 lg:hidden" @click.stop="$emit('toggle-sidebar')" aria-controls="sidebar" :aria-expanded="sidebarOpen">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="5" width="16" height="2" />
              <rect x="4" y="11" width="16" height="2" />
              <rect x="4" y="17" width="16" height="2" />
            </svg>
          </button>

        </div>

        <!-- Header: Right side -->
        <div class="flex items-center space-x-3 justify-end">
          <HomeNavbarButton />
          <BalanceHistoryNavbarButton v-if="$CAN_TOP_UP_ACCOUNT" />
          <WithdrawalNavbarButton v-if="IS_SELLER || IS_BOSS" />
          <BarHistoryNavbarButton v-if="$CAN_TOP_UP_ACCOUNT || $CAN_SALE_BAR" />
          <SolariumHistoryNavbarButton v-if="$CAN_WRITE_OFF_SERVICES" />
          <SaleHistoryNavbarButton v-if="$CAN_SALE_PRODUCTS" />
          <CurrentKeysNavbarButton v-if="$CAN_OPEN_SESSION" />
          <BookmarkNavbarButton />
          <ClientsButton />
          <Notifications align="right" v-if="false"/>
          <!-- Divider -->
          <hr class="w-px h-6 bg-gray-200" />
          <UserMenu align="right" />
        </div>

      </div>
    </div>
  </header>
</template>

<script>
import SearchModal from "@/components/Modals/SearchModal";
import Notifications from "@/components/Utils/Notifications";
import Help from "@/components/Navigation/Buttons/Help";
import UserMenu from "@/components/Navigation/Buttons/UserMenu";
import userMixin from '@/mixins/userMixin';
export default {
  name: 'Header',
  props: ['sidebarOpen'],
  mixins: [userMixin],
  components: {SearchModal, Notifications, Help, UserMenu},
  data: () => ({
    searchModalOpen: false,
  }),
}
</script>
