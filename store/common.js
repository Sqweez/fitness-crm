export const state = () => ({
  clubs: [],
  roles: [],
  service_types: [],
  payment_types: [
    {
      id: 1,
      name: 'Наличные'
    },
    {
      id: 2,
      name: 'Безналичные'
    }
  ],
});
export const getters = {
  CLUBS: s => s.clubs,
  CLUBS_FILTERS: s => [{id: -1, name: 'Все'}, ...s.clubs],
  ROLES: s => s.roles,
  ROLES_FILTERS: s => [{id: -1, name: 'Все'}, ...s.roles],
  SERVICE_TYPES: s => s.service_types,
  SERVICE_TYPES_FILTER: s => [{id: -1, name: 'Все'}, ...s.service_types],
  PAYMENT_TYPES: s => s.payment_types,
  PAYMENT_TYPES_FILTER: s => [{id: -1, name: 'Все'}, ...s.payment_types],
};
export const mutations = {
  setClubs (state, clubs) {
    state.clubs = clubs;
  },
  setRoles (state, roles) {
    state.roles = roles;
  },
  setServiceTypes (state, types) {
    state.service_types = types;
  }
};
export const actions = {
  async getClubs ({ commit }) {
    try {
      this.$loader.enable();
      const { data } = await this.$axios.$get('v1/clubs');
      commit('setClubs', data);
    } catch (e) {
      this.$toast.error(e.response.data.message);
    } finally {
      this.$loader.disable();
    }
  },
  async getRoles ({ commit }) {
    try {
      this.$loader.enable();
      const { data } = await this.$axios.$get('v1/roles');
      commit('setRoles', data);
    } catch (e) {
      this.$toast.error(e.response.data.message);
    } finally {
      this.$loader.disable();
    }
  },
  async getServiceTypes ({ commit }) {
    try {
      this.$loader.enable();
      const data = await this.$axios.$get('v1/services/types');
      commit('setServiceTypes', data);
    } catch (e) {
      this.$toast.error(e.response.data.message);
    } finally {
      this.$loader.disable();
    }
  }
};
