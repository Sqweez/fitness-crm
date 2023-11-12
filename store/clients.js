import {comment} from 'postcss';
import {__hardcoded} from '@/utils/helpers';

export const state = () => ({
  clients: [],
  client: null,
  searched_clients: [],
});
export const getters = {
  clients: s => s.clients,
  CLIENT: s => s.client,
  SEARCHED_CLIENTS: s => s.searched_clients,
};
export const mutations = {
  setClients (state, clients) {
    state.clients = clients;
  },
  setClient (state, client) {
    state.client = {...client};
  },
  setClientBalance (state, balance) {
    state.client = {...state.client, balance};
  },
  setPurchasedProgram (state, program) {
    state.client = {
      ...state.client,
      programs: state.client.programs.map(p => {
        if (p.id === program.id) {
          p = {...program};
        }
        return p;
      })
    }
  },
  setSearchedClients (state, clients) {
    state.searched_clients = clients;
  },
  stopCard (state, id) {
    state.client = {
      ...state.client,
      programs: state.client.programs.map(p => {
        if (p.id === id) {
          p.is_stopped = true;
          p.can_be_used = false;
        }
        return p;
      })
    };
  },
};
export const actions = {
  async getClients ({ commit }) {
    const { data } = await this.$axios.$get('v1/clients');
    commit('setClients', data);
  },
  async searchClients ({ commit }, search) {
    const { data: { data } } = await this.$axios.get(`v1/clients/search?search=${search}`);
    commit('setSearchedClients', data);
  },
  async createClient ({ commit }, payload) {
    const data = await this.$axios.$post('v1/clients', payload);
    return data.client;
  },
  async getClient ({ commit }, id) {
    const { data } = await this.$axios.$get(`v1/clients/${id}`);
    commit('setClient', data);
  },
  async updateClient ({ commit, getters }, payload) {
    const data = await this.$axios.$post(`v1/clients/${getters.CLIENT.id}?_method=PATCH`, payload);
    commit('setClient', data.client);
  },
  async removeClient ({ commit, getters }) {
    await this.$axios.$delete(`v1/clients/${getters.CLIENT.id}`);
  },
  async topUpAccount ({ commit }, payload) {
    const data = await this.$axios.$post(`v1/clients/${payload.client_id}/top-up`, payload);
    commit('setClientBalance', data.balance)
  },
  async createServiceSale ({ commit }, payload) {
    const data = await this.$axios.$post('v1/sale/service', payload);
    commit('setClient', data.client);
  },
  async createProductSale ({ commit }, payload) {
    const data = await this.$axios.$post('v1/sale/product', payload);
    commit('setClient', data.client);
    return data.product;
  },
  async createSale ({ commit }, payload) {
    const data = await this.$axios.$post('v1/sale', payload);
    commit('setClient', data.client);
  },
  async activateProgram ({ commit }, id) {
    const data = await this.$axios.$post(`v1/services/activate/${id}`);
    commit('setPurchasedProgram', data.program);
  },
  async writeOffVisit ({ commit }, payload) {
    const data = await this.$axios.$post('v1/session/write-off', payload);
    commit('setClient', data.client);
  },
  async writeOffSolarium ({ commit }, payload) {
    const data = await this.$axios.$post('v1/session/solarium', payload);
    commit('setClient', data.client);
  },
  async penaltyWriteOffVisit ({ commit }, payload) {
    await this.$axios.$post('v1/penalty', payload);
  },
  async attachTrinket ({ commit, getters }, code) {
    const payload = {
      code,
    };
    const data = await this.$axios.$post(`v1/session/attach/${getters.CLIENT.id}`, payload);
    commit('setClient', data.client);
  },
  async finishVisit ({commit, getters}) {
    const data = await this.$axios.$get(`v1/session/finish/${getters.CLIENT.id}`);
    commit('setClient', data.client);
  },
  async restoreService ({ commit }, { payload, serviceId }) {
    const data = await this.$axios.$post(`v1/restored/${serviceId}`, payload);
    commit('setClient', data.client);
  },
  async getPurchasedServiceInformation ({ commit }, { serviceId, clientId }) {
    const query = (serviceId ? `service_id=${serviceId}` : '');
    return await this.$axios.get(`v1/clients/${clientId}/service/history?${query}`);
  },
  async updatePurchasedService ({ commit }, { serviceId, payload }) {
    const data = await this.$axios.$patch(`v1/services/purchased/${serviceId}`, payload);
    commit('setPurchasedProgram', data.program);
  },
  async getClientHistory (store, queryString) {
    return await this.$axios.get(`v1/clients/${store.getters.CLIENT.id}/history?${queryString}`);
  },
  async remakePass ({ commit, getters }, pass) {
    try {
      await this.$axios.post(`v1/clients/${getters.CLIENT.id}/pass`, { pass });
      commit('setClientBalance', getters.CLIENT.balance - __hardcoded(1000));
    } catch (e) {
      console.log(e);
    }
  },
  async stopCard ({ commit }, payload) {
    await this.$axios.$post(`v1/services/stop/${payload.id}`, payload);
    commit('stopCard', payload.id);
  },
  async unStopCard ({ dispatch }, payload) {
    await this.$axios.$post(`v1/services/unstop/${payload.id}`);
    await dispatch('getClient', payload.client_id);
  }
};
