export const state = () => ({
  services: [],
  service: null,
});
export const getters = {
  SERVICES: s => s.services,
  SERVICE: s => s.service,
};
export const mutations = {
  createService (state, service) {
    state.services.push(service)
  },
  setServices (state, services) {
    state.services = services;
  },
  deleteService (state, id) {
    state.services = state.services.filter(s => s.id !== id);
  },
  setService (state, service) {
    state.service = service;
  },
  editService (state, service) {
    state.services = state.services.map(s => {
      if (s.id === service.id) {
        s = { ...service };
      }
      return s;
    })
  }
};
export const actions = {
  async getServices ({ commit }) {
    const { data } = await this.$axios.$get('v1/services');
    commit('setServices', data);
  },
  async createService ({ commit }, payload) {
    const data = await this.$axios.$post('v1/services', payload);
    commit('createService', data.service);
  },
  async deleteService ({ commit }, id) {
    await this.$axios.$delete(`v1/services/${id}`);
    commit('deleteService', id);
  },
  async getService ({ commit }, id) {
    const { data } = await this.$axios.$get(`v1/services/${id}`);
    commit('setService', data);
  },
  async editService ({ commit }, payload) {
    const data = await this.$axios.$patch(`v1/services/${payload.id}`, payload);
    commit('editService', data.service);
  },
};
