export const state = () => ({
  user: null,
});
export const getters = {
  $isLoggedIn: state => !!state.user,
  $user: state => state.user,
  $currentClub: state => state.user.club?.id,
  IS_BOSS: state => state.user.is_boss,
  $CAN_SALE_SERVICES: state => state.user.can_sale_service,
};
export const mutations = {
  setUser (state, user) {
    state.user = user;
  }
};

export const actions = {
  async chooseClub (store, payload) {
    await this.$axios.post(`v1/users/${store.getters.$user.id}/club`, {
      club_id: payload
    })
  },
  async createWithDrawal (store, payload) {
    await this.$axios.post(`v1/withdrawals`, payload);
  },
};
