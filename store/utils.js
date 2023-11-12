export const state = () => ({
  isLoading: false,
  loaderMessage: null
})

export const getters = {
  IS_LOADING: s => s.isLoading,
  LOADER_MESSAGE: s => s.loaderMessage,
}

export const mutations = {
  setLoaderMessage (state, message = null) {
    state.loaderMessage = message;
  },
  setLoading (state, bool) {
    if (bool === false) {
      state.loaderMessage = null;
    }
    state.isLoading = bool;
  },
  toggleLoading (state) {
    if (state.isLoading) {
      state.loaderMessage = null;
    }
    state.isLoading = !state.isLoading;
  },
}

export const actions = {
  setLoading ({ commit, getters }, bool) {
    commit('setLoading', bool);
    if (bool === false && getters.loaderMessage) {
      commit('setLoaderMessage', null);
    }
  },
  toggleLoading ({ commit, getters }) {
    commit('toggleLoading');
    if (getters.loaderMessage) {
      commit('setLoaderMessage', null);
    }
  }
}
