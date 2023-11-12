export const state = () => ({
  accounts_top_ups: [],
  programs_purchased: [],
  club_guests: [],
  new_clients: [],
  clients_balance: [],
  graphReports: [],
});
export const getters = {
  ACCOUNTS_TOP_UPS: s => s.accounts_top_ups,
  PROGRAMS_PURCHASED: s => s.programs_purchased,
  CLUB_GUESTS: s => s.club_guests,
  NEW_CLIENTS: s => s.new_clients,
  CLIENTS_BALANCE: s => s.clients_balance,
  GRAPH_REPORTS: s => s.graphReports,
};
export const mutations = {
  setReports (state, reports) {
    state.accounts_top_ups = reports.accounts_top_ups;
    state.programs_purchased = reports.programs_purchased;
    state.club_guests = reports.club_guests;
    state.new_clients = reports.new_clients;
  },
  setClientsBalance (state, balances) {
    state.clients_balance = balances;
  },
  setGraphReports (state, payload) {
    state.graphReports = payload;
  }
};
export const actions = {
  async getReports ({ commit }, payload) {
    const params = new URLSearchParams(payload);
    const data = await this.$axios.$get(`v1/economy?${params}`);
    commit('setReports', data.reports);
  },
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
