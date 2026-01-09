import featuresMixin from '@/mixins/featuresMixin';

export default {
  mixins: [featuresMixin],
  computed: {
    $isLoggedIn () {
      return this.$store.getters['user/$isLoggedIn']
    },
    $user () {
      return this.$store.getters['user/$user']
    },
    $currentClub () {
      return this.$store.getters['user/$currentClub'];
    },
    IS_BOSS () {
      return this.$store.getters['user/IS_BOSS']
    },
    IS_SELLER () {
      return this.$user.is_seller;
    },
    IS_BARTENDER () {
      return this.$user.is_bartender;
    },
    IS_SENIOR_BARTENDER () {
      return this.$user.roles.some(r => [8].includes(r.id));
    },
    $CAN_SALE_SERVICES () {
      return this.$store.getters['user/$CAN_SALE_SERVICES'];
    },
    $CAN_TOP_UP_ACCOUNT () {
      return this.$user.permissions.can_top_up_account;
    },
    $CAN_WRITE_OFF_SERVICES () {
      return this.$user.permissions.can_write_off_services;
    },
    $CAN_SEE_PURCHASED_SERVICES () {
      return this.$user.permissions.can_see_purchased_services;
    },
    $CAN_SALE_PRODUCTS () {
      return this.$user.permissions.can_sale_products;
    },
    $CAN_SALE_BAR () {
      return this.$user.permissions.can_sale_bar;
    },
    $CAN_OPEN_SESSION () {
      return this.$user.permissions.can_open_session;
    }
  }
}
