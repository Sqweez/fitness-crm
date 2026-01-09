const DEFAULT_FEATURES = {
  hasMobileApplication: false,
};

export const state = () => ({
  // In future this will come from API via user.club.features
  clubFeatures: null,
});

export const getters = {
  hasFeature: (state) => (featureName) => {
    if (state.clubFeatures && featureName in state.clubFeatures) {
      return state.clubFeatures[featureName];
    }
    return DEFAULT_FEATURES[featureName] ?? false;
  },

  hasMobileApplication: (state, getters) => {
    return getters.hasFeature('hasMobileApplication');
  },
};

export const mutations = {
  setClubFeatures(state, features) {
    state.clubFeatures = features;
  },
};

export const actions = {
  updateFeatures({ commit }, features) {
    commit('setClubFeatures', features);
  },
};
