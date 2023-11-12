export const state = () => ({});
export const getters = {};
export const mutations = {};
export const actions = {
  async INIT ({ dispatch, commit }) {
    // @TODO получать наиболее общие данные
    this.$loader.enable();
    commit('user/setUser', this.$auth.user);
    await Promise.all([
      await dispatch('users/getUsers'),
      await dispatch('common/getClubs'),
      await dispatch('common/getRoles'),
      await dispatch('common/getServiceTypes'),
      await dispatch('products/getCategories'),
    ]);
    this.$loader.disable();
  }
};
