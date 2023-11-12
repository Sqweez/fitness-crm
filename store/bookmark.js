export const state = () => ({
  bookmarks: []
});
export const getters = {
  bookmarks: state => state.bookmarks
};
export const mutations = {
  setBookmarks (state, payload) {
    state.bookmarks = payload;
  },
  removeFromBookmark (state, id) {
    state.bookmarks = state.bookmarks.filter(b => b.id !== id);
  },
};
export const actions = {
  async createBookmark ({ commit }, payload) {
    const data = await this.$axios.$post('v1/bookmarks', payload);
    commit('setBookmarks', data);
  },
  async removeFromBookmark ({ commit }, id) {
     await this.$axios.$delete(`v1/bookmarks/${id}`);
     commit('removeFromBookmark', id);
  },
  async getBookmarks ({ commit }) {
    const { data } = await this.$axios.$get('v1/bookmarks');
    commit('setBookmarks', data);
  }
};
