<template>
  <div>
    <v-row>
      <v-col cols="12">
        <WelcomeBanner />
      </v-col>
      <v-col sm="12" md="12" v-if="showClientsWidget">
        <clients-page />
      </v-col>
      <v-col sm="12" md="12" v-if="showBarWorkingPage">
        <lazy-bartender-working-page />
      </v-col>
      <v-col sm="12" md="12" v-if="isSeniorBartender">
        <products-index-page />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import userMixin from '@/mixins/userMixin';
import ClientsPage from '@/pages/clients';
import ProductsIndexPage from '@/pages/commerce/products';

export default {
  components: {ProductsIndexPage, ClientsPage},
  mixins: [
    userMixin
  ],
  computed: {
    showBarWorkingPage () {
      return this.$auth.user.roles.some(r => [4, 8].includes(r.id));
    },
    showClientsWidget () {
      return this.$auth.user.roles.some(r => [1, 2, 3, 4, 8].includes(r.id));
    },
    showActiveClientsPage () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    showSleepingClientsPage () {
      return this.$auth.user.roles.some(r => [1, 3].includes(r.id));
    },
    showBirthdayClientsPage () {
      return this.$auth.user.roles.some(r => [1, /*2*/ 3].includes(r.id));
    },
    showTodayGuestClientsPage () {
      return this.$auth.user.roles.some(r => [1, 2, 3].includes(r.id));
    },
    isSeniorBartender() {
      return this.$auth.user.roles.some(r => [8].includes(r.id));
    }
  },
}
</script>
