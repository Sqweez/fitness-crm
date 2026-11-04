export const state = () => ({
  clients_balance: [],
  graphReports: [],
});
export const getters = {
  CLIENTS_BALANCE: s => s.clients_balance,
  GRAPH_REPORTS: s => s.graphReports,
};
export const mutations = {
  setClientsBalance (state, balances) {
    state.clients_balance = balances;
  },
  setGraphReports (state, payload) {
    state.graphReports = payload;
  }
};
export const actions = {
  async getGraphReports ({ commit }, payload) {
    const params = new URLSearchParams(payload);
    const data = await this.$axios.$get(`v1/economy/graphs?${params}`);
    commit('setGraphReports', data.reports);
  },
  async getClientsBalance ({ commit }) {
    const data = await this.$axios.$get(`v1/economy/balance`);
    commit('setClientsBalance', data.reports);
  }
};
